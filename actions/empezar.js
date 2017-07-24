var builder = require('botbuilder');

module.exports = function(session){
		console.log("Entre a empezar!");
		session.send("Hola! Soy DiBot. Te ayudaré con todo lo relacionado a tus obligaciones tributarias. A continuacion te muestro algunas de operaciones en las que te puedo ayudar");
		var msg = getHelpCards();
		session.send(msg)
		session.endDialog();
};


function getHelpCards(){
	return new builder.Message()
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
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Generar mi rut",
                    "value":"Por favor quiero crear mi rut"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Formalizar mi RUT",
                "subtitle": "Quiero formalizar mi RUT",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Formalizar+RUT&w=500&h=260"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "formalizar mi RUT",
                    "value":"formalizar mi rut"
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
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Actualizar mi RUT",
                    "value":"Actualizar mi rut"
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
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Notificaciones",
                    "value":"notificaciones"
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
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Quiero agendar una cita",
                    "value":"Quiero agendar una cita"
                  }
                ]
            }
        }
    ]);
}