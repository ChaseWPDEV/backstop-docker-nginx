
const backstopjs=require('/usr/local/lib/node_modules/backstopjs');
const sendmail=require('sendmail');
const winston= require('winston');
const {format, transports} = winston;

const manifest= require('./config/manifest.json');
const commonConfig= require('./config/common.json');
const commonScenarios= require('./config/scenarios.json').scenarios;

const parseArgs = require('minimist');


const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { service: 'cwpdev-backstop' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `quick-start-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
      //
      new transports.File({ filename: './config/error.log', level: 'error' }),
      new transports.File({ filename: './config/combined.log' })
    ]
  });

function main(){
    const argsOptions = parseArgs(process.argv.slice(2));
    const autoApprove= argsOptions._[0] === 'approve';

        manifest.sites.forEach(detailConfig=>{
            
            let scenarios=[...commonScenarios, ...detailConfig.scenarios]
            .filter((page=>{
                if(! detailConfig.exclude){
                    return true;
                }
                return detailConfig.exclude.indexOf(page.label) === -1;
            }))
            .map(page=>{
                if(page.commonUrl){
                    page.url=detailConfig.rootUrl+page.commonUrl;
                } else {
                    page.url=detailConfig.rootUrl+page.url;
                }
                return page;
            });

            const paths={
                "bitmaps_reference": `./config/html/references/${detailConfig.id}`,
                "bitmaps_test": `./config/html/tests/${detailConfig.id}`,
                "engine_scripts": "./config/scripts",
                "html_report": `./config/html/reports/${detailConfig.id}`
                };
            
                const testConfig={ ...commonConfig, ...detailConfig, ...{
                    "scenarios": scenarios,
                    "paths": paths
                }
            }

            if(autoApprove){
                backstopjs('approve', {'config': testConfig})
                    .catch((err)=>{
                        logger.log({
                            level: 'error',
                            'message': err
                        })
                });
            } else {
            backstopjs('test', {'config' : testConfig})
                .then(()=> {})
                .catch(()=>{
                    let setAlerts=new Set([...commonConfig.alerts, ...(detailConfig.alerts || [])]);
                    Array.from(setAlerts).map(address=>
                        sendmail({
                            from: 'no-reply@boosterprep.com',
                            to: address,
                            subject: `Backstop failure on ${detailConfig.id}`,
                            html: `There has been a failure for backstop tests on ${commonConfig.rootUrl}.
                            Please visit the <a href="http://3.98.137.178/${detailConfig.id}">Backstop report page</a> for details.`
                        }, function(err, reply){
                            logger.log({
                                level: 'error',
                                'message': err && err.stack
                            });
                        }));
                })
            }
        });
}

main();