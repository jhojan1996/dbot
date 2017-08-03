var builder = require('botbuilder');
var util = require('util');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var fs = require('fs');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'dibot2017@gmail.com',
		pass: 'Innovati2017+'
	}
});

module.exports = function(session){
	console.log("Inicia accion para actualizar rut");
	session.dialogData.formalizarRut = true;
	var idUsuario = session.userData.idUsuario;
	if(!idUsuario){
		console.log("No tiene idusuario");
		session.send("Para actualizar el RUT debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
		session.send("Para ingresar al sistema presione el boton Log In");
			var message = new builder.Message(session)
		      .sourceEvent({
		        facebook: {
		          attachment: {
		            type: 'template',
		            payload: {
		              template_type: 'generic',
		              elements: [{
		                title: 'Ingresar al sistema',
		                image_url: "http://dibot.azurewebsites.net/images/login1.png",
		                buttons: [{
		                  type: 'account_link',
		                  url: process.env.FRONT_END_URL + '/web/login.html'
		                }]
		              }]
		            }
		          }
		        }
		      });
		    session.send(message);
			session.send("Para crear el rut presione en siguiente botón: ");
			var msg = getHelpCards();			
			session.endDialog(msg);
	}else{
		console.log("Tiene ingreso en el sistema");
		session.send("Claro. te ayudare a actualizar el RUT");
		session.send("Preciona el boton 'Actualizar RUT' para ingresar al formulario");
		var msg = getHelpCards();
		session.endDialog(msg);
		
	}
}

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
                    "url": "http://dibot.azurewebsites.net/images/crearrut.png"
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
        }
    ]);
}