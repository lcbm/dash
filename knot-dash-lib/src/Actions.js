const request = require('request');

const Actions = {
  toSlack: (message, url) => {
    request.post({ url: url, json: message }, (err, res) => {
      console.log(message);
    });
  }
}

module.exports = Actions;
