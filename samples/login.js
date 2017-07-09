var util = require('util');
var builder = require('botbuilder');
var LuisActions = require('../core');

var logIn = {
    intentName: 'Login',
    friendlyName: 'Ingresar',
    confirmOnContextSwitch: true,
    schema: {},
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        var message = new builder.Message()
            .sourceEvent({
                facebook: {
                    attachment: {
                        type: 'template',
                        payload: {
                        template_type: 'generic',
                        elements: [{
                            title: 'Ingresar al sistema',
                            image_url: "https://placeholdit.imgix.net/~text?txtsize=35&txt=Ingreso+al+sistema&w=500&h=260",
                            buttons: [{
                                type: 'account_link',
                                url: FRONTEND_URL + '/views/login.html'
                            }]
                        }]
                    }
                }
            }
        });
        callback(message);
    }
};

module.exports = logIn;