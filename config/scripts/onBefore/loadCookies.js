const fs = require('fs');
const axios = require('axios').default;
const https = require('https');
const { resolve } = require('path');

module.exports = async (page, config) => {
  let cookies = [];

  // RETRIEVE LOGIN COOKIES FROM ENDPOINT
  const username = config.username;
  const authPassword = config.applicationPassword;

  const url = config.authCookieUrl;
  
  const logInCookie = await axios({
    url: url,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    responseType: 'json',
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }),
    auth : {
      username: username,
      password: authPassword
    }
  }).then((response)=>{
    const data = JSON.parse(response.data);
    return ([{
      "url": config.rootUrl,
      "path": "",
      "name": data.login_cookie_name,
      "value":data.logged_in_cookie,
      "expirationDate": data.expiration,
      "hostOnly": true,
      "httpOnly": true,
      "secure": true,
      "session": false,
      "sameSite": "no_restriction"
    }]);
  })
  .catch(error => {
    console.log("ERROR", error, "ERROR END");
  });
  

  // SET COOKIES
  const setCookies = async () => {
    return Promise.all(
      logInCookie.map(async (cookie) => {
        await page.setCookie(cookie);
      })
    );
  };

  await setCookies();
};
