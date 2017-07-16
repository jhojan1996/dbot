var builder = require('botbuilder');
var request = require('request');

module.exports = function(session){
  request({
      url: 'https://graph.facebook.com/v2.6/me/unlink_accounts',
      method: 'POST',
      qs: {
        access_token: process.env.FACEBOOK_PAGE_TOKEN
      },
      body: {
        psid: session.message.address.user.id
      },
      json: true
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // No need to do anything send anything to the user
        // in the success case since we respond only after
        // we have received the account unlinking webhook
        // event from Facebook.
        session.endDialog("Saliste de cuenta correctamente.");
      } else {
        session.endDialog('Error saliendo de la cuenta, intentalo de nuevo');
      }
    });
};
