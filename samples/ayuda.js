var util = require('util');
var builder = require('botbuilder');
var LuisActions = require('../core');

var ayuda = {
	intentName: 'Ayuda',
    friendlyName: 'Ayuda del chat',
    confirmOnContextSwitch: true,
    schema: {},
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (parameters, callback) {
        callback(
        	new builder.Message()
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Crear RUT",
                        "subtitle": "Quiero generar mi RUT",
                        "images": [
                          {
                            "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Crear+RUT&w=500&h=260"
                          }
                        ]
                        /*"buttons": [
                          {
                            "title": "More details",
                            "type": "openUrl",
                            "value": "https://www.bing.com/search?q=hotels+in+seattle"
                          }
                        ]*/
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Formalizar el RUT",
                        "subtitle": "Quiero formalizar mi RUT",
                        "images": [
                          {
                            "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Formalizar+RUT&w=500&h=260"
                          }
                        ]
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Actualizar el RUT",
                        "subtitle": "Quiero actualizar mi RUT",
                        "images": [
                          {
                            "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Actualizar+RUT&w=500&h=260"
                          }
                        ]
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Notificaciones",
                        "subtitle": "Quiero subscribirme al servicio de notificaciones",
                        "images": [
                          {
                            "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Notificaciones&w=500&h=260"
                          }
                        ]
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Agendar citas",
                        "subtitle": "Quiero agendar una cita",
                        "images": [
                          {
                            "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Agendar+citas&w=500&h=260"
                          }
                        ]
                    }
                }
            ])
        );
    }
};

module.exports = ayuda;