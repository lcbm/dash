const request = require('request');
const Actions = require('./Actions');

const Router = {
  slack: (button) => {
    let slack = button.slack;
    let timestamp = new Date();
    let message = {
      username: slack.username,
      channel: slack.channel,
      text: slack.message,
      timestamp: timestamp.toLocaleString()
    };
    
    if(button.timeout)
      setTimeout(() => { 
        Actions.toSlack(message, slack.webhook) 
      }, button.timeout);
  
    else
      Actions.toSlack(message, slack.webhook);
  }
}

module.exports = Router;
