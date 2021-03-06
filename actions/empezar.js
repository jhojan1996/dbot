var builder = require('botbuilder');

module.exports = function(session){
	console.log("Entre a empezar!");
    console.log("SESSION ELEMENT------------------>",session);
    let message = new builder.Message(session)
    .text("Hola. Te puedo ayudar a recordar tus obligaciones tributarias enviandote mensajes a tu celular antes de que estas se venzan.")
    .sourceEvent({
        facebook: {
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Ok. Hagámoslo.",
                    "payload": "Ayuda"
                },
                {
                    "content_type": "text",
                    "title": "No. Gracias.",
                    "payload": "Terminar"
                }
            ]
        }
    });
	session.send(message);
	session.endDialog();
};