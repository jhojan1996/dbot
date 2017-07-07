var util = require('util');
var builder = require('botbuilder');
var LuisActions = require('../core');
var nodemailer = require('nodemailer');
var mysql = require('mysql');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jhojanestiven1996@gmail.com',
    pass: 'stressprotect1996'
  }
});

var connection = mysql.createConnection(
    {
      host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
      user     : 'bdfb18a7b2c383',
      password : '669f8c04',
      database : 'dibot'
    }
);
         

var logIn = {
    intentName: 'Login',
    friendlyName: 'Ingresar',
    confirmOnContextSwitch: true,
    schema: {},
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        var message = new builder.Message(session)
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
                                url: FRONTEND_URL + '/files/login.html'
                            }]
                        }]
                    }
                }
            }
        });
        callback(
            message
        );
    }
};

module.exports = crearRut;


function formatDate(date) {
    var offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + offset).toDateString();
}