var builder = require('botbuilder');

module.exports = function(session){
		console.log("Entre a la ayuda!");
		var msg = getHelpCards();
    session.send("A continuación te mostrare las tareas en la que te puedo ayudar");
		session.send(msg);
		session.endDialog();
};

function getHelpCards(){
	return new builder.Message()
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments([
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Ingresar al sistema (necesita tener el RUT creado).",
                "subtitle": 'Frase: "Ingresar".',
                "images": [
                  {
                    "url": "http://dibot.azurewebsites.net/images/login1.png"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Ingresar al sistema",
                    "value":"Ingresar al sistema"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Crear RUT",
                "subtitle": 'Frases: "Crear RUT", "Generar RUT", "Sacar RUT".',
                "images": [
                  {
                    "url": "http://dibot.azurewebsites.net/images/crearrut.png"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Crear RUT",
                    "value":"Por favor quiero crear mi rut"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Formalizar mi RUT",
                "subtitle": 'Frases: "Formalizar mi RUT", "Formalizar RUT".',
                "images": [
                  {
                    "url": "http://dibot.azurewebsites.net/images/formalizar.jpg"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Formalizar mi RUT",
                    "value":"formalizar mi rut"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Recibir notificaciones",
                "subtitle": 'Frases: "Quiero subscribirme al servicio de notificaciones", "Subscribirme a la notificaciones", "Enviame notificaciones"',
                "images": [
                  {
                    "url": "http://dibot.azurewebsites.net/images/notificacion.png"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Recibir notificaciones",
                    "value":"notificaciones"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Agendar cita",
                "subtitle": 'Frases: "Quiero agendar una cita", "Agendar una cita", "Quiero pedir una cita"',
                "images": [
                  {
                    "url": "http://dibot.azurewebsites.net/images/agendar.jpg"
                  }
                ],
                "buttons": [
                  {
                    "type": "postBack",
                    "title": "Agendar cita",
                    "value":"Quiero agendar una cita"
                  }
                ]
            }
        }
    ]);
}