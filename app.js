
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

        for(let i in manifest.sites){
            let config=manifest.sites[i];
            
            let scenarios=[...commonScenarios, ...config.scenarios]
                .map(page=>{
                    page.url=config.rootUrl+page.url;
                    return page;
                });

            let paths={
                "bitmaps_reference": `./config/html/references/${config.id}`,
                "bitmaps_test": `./config/html/tests/${config.id}`,
                "engine_scripts": "./config/scripts",
                "html_report": `./config/html/reports/${config.id}`
                };
            
                let testConfig={ ...commonConfig, ...config, ...{
                    "scenarios": scenarios,
                    "paths": paths
                }
            }

            if(autoApprove){
                backstopjs('approve', {config: testConfig})
                    .catch((err)=>{
                        logger.log({
                            level: 'error',
                            'message': err
                        })
                });
            } else {
            backstopjs('test', {config : testConfig})
                .then(()=> {})
                .catch(()=>{
                    let setAlerts=new Set([...commonConfig.alerts, ...(config.alerts || [])]);
                    Array.from(setAlerts).map(address=>
                        sendmail({
                            from: 'no-reply@boosterprep.com',
                            to: address,
                            subject: `Backstop failure on ${config.id}`,
                            html: `There has been a failure for backstop tests on ${commonConfig.rootUrl}.
                            Please visit the <a href="http://3.98.137.178/${config.id}">Backstop report page</a> for details.`
                        }, function(err, reply){
                            logger.log({
                                level: 'error',
                                'message': err && err.stack
                            });
                        }));
                })
            }
        }
}

main();