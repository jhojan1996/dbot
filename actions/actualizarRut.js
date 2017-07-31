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
		session.send("Para crear el rut precione en siguiente boton: ");
		var msg = getHelpCards();
		session.send(msg);
		session.send("Para ingresar al sistema precione el boton Log In");
		var message = new builder.Message(session)
	      .sourceEvent({
	        facebook: {
	          attachment: {
	            type: 'template',
	            payload: {
	              template_type: 'generic',
	              elements: [{
	                title: 'Ingresar al sistema',
	                image_url: "https://placeholdit.imgix.net/~text?txtsize=35&txt=Ingeso+al+sistema&w=500&h=260",
	                buttons: [{
	                  type: 'account_link',
	                  url: process.env.FRONT_END_URL + '/web/login.html'
	                }]
	              }]
	            }
	          }
	        }
	      });
		session.endDialog(message);
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
                "title": "Actualizar RUT",
                "subtitle": "Quiero actualizar mi RUT",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Actualizar+RUT&w=500&h=260"
                  }
                ],
                "buttons": [
                  {
                    "type": "openUrl",
                    "title": "Actualizar mi rut",
                    "value": process.env.FRONT_END_URL +"/process/action.php"
                  }
                ]
            }
        }
    ]);
}