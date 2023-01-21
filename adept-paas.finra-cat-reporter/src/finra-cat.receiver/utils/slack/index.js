const https = require('https');

function post(options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        res.data = data;
        resolve(res);
      });

    }).on("error", (err) => {
      reject(err);
    });

    req.write(data);
    req.end();

  });

}

module.exports = sendToSlack = (msg, main = false) => {

  if(main) {

    const data = JSON.stringify({
      channel: "#finra-reporter-events",
      username: "FinraReporterBOT",
      text: msg,
      icon_emoji: ":information_source:"
    });

    const options = {
      hostname: 'hooks.slack.com',
      path: '/services/TA3L6QHLK/B016B9UC74H/sHOaXC89a9tSCX7jW0KgnzKf',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }

    post(options, data);

  }

  const data = JSON.stringify({
    channel: "#finra-reporter-events-dev",
    username: "FinraReporterBOT",
    text: msg,
    icon_emoji: ":information_source:"
  });

  const options = {
    hostname: 'hooks.slack.com',
    path: '/services/TA3L6QHLK/B015VQ07N5R/KHbFxBEAwZMJSJnm55huuePz',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  post(options, data);

}
