var builder = require('botbuilder');

module.exports = [
	function(session){
		console.log("Entre a la ayuda!");
		session.send("Hola! Soy DiBot. A continuacion te mostrare las acciones en las que puedo ayudar: ");
		var msg = getHelpCards();
		session.send(msg)
		session.endDialog();
	}
];

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
    ]);
}