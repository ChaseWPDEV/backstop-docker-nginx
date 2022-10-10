module.exports = async (page, scenario, viewport, isReference, Engine, config) => {
    if(config.username){
    await require('./loadCookies')(page, config);
    }
  };