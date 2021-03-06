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

var pool = mysql.createPool({
    connectionLimit : 10,
    host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user     : 'bdfb18a7b2c383',
    password : '669f8c04',
    database : 'dibot'
});

module.exports = [
	function(session){
		console.log("Inicia accion para formalizar rut");
		session.dialogData.formalizarRut = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para formalizar el RUT debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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
			session.send("Claro. te ayudare a formalizar el RUT");
			session.beginDialog("SubirCedula");
		}
	},
	function(session, result){
		console.log("ARCHIVO SUBIDO INFO COMPLETA ------------------->",result.response[0]);
		console.log("ARCHIVO SUBIDO------------>",result.response[0].contentUrl);
		session.dialogData.archivoSubido = result.response[0].contentUrl;
		var tipo_doc = result.response[0].contentType;
		console.log("IMAGEN ADJUNTADA-------------->",session.dialogData);

		if(tipo_doc === 'image/png' || tipo_doc === 'image/jpg' || tipo_doc === 'image/jpeg'){
			updateRut(session);
			session.send("Tu imagen fue guardada con exito y sera enviada a revision, cuando termine el proceso te enviaremos un correo con el resultado de la formalización.");
		}else{
			session.send("El archivo adjunto no es valido. Recuerda que debe ser una imagen. Por favor intentalo de nuevo");
		}
		session.send("¿En qué más te puedo ayudar?");
		var msj = getAllCards();
		session.endDialog(msj);
	}
];


function updateRut(session){
	console.log("DATOS PARA EL UPDATE EN RUT------------------>",session.dialogData);

	var archivoSubido = session.dialogData.archivoSubido;
	var idUsuario = session.userData.idUsuario;
	pool.getConnection(function(err, connection){
		connection.beginTransaction(function(err) {
			if (err) {
				console.log("ERROR 1-------->",err); 
				throw err; 
			}
			
			console.log(session.userData);
			connection.query('UPDATE rut SET image_url = ? WHERE id_usuario = ?', [archivoSubido, idUsuario], function(err, result) {
				console.log("ERROR: ----------------> "+err+" ||| RESULT ------------>:"+result);
				if (err) { 
					console.log("ERROR 2:------------>",err);
					connection.rollback(function() {
						console.log("ERROR 3------------->",err)
						return err;
					});
				}

				connection.commit(function(err) {
					console.log("ERROR 4:------------>",err);
					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}

					connection.query("SELECT email FROM usuario WHERE id = ?",idUsuario, function(err, result, fields) {
			            if (err) throw err;
			            if(result.length > 0){
			                var email = result[0].email;
			            
				            var mailOptions = {
								from: 'dibot2017@gmail.com',
								to: email,
								subject: 'Inicio del proceso de formalización del RUT',
								html: 'Su solicitud de formalización del RUT ha iniciado.<br/>La imagen que hemos recibido de su documento de identificación es la siguiente:<br/> <img src="'+archivoSubido+'" width="200px"/><br/>Proximamente le notificaremos por este mismo medio si el proceso termino exitosamente.<br/><br/>Atentamente,<br/>Asistente tributario.<br/><img src="http://dibot.azurewebsites.net/images/dibot.png" width="100px" /><br/>Un desarrollo de Innovati centro de innovación. www.innovati.com.co<br/><img src="http://dibot.azurewebsites.net/images/logo_innovati.jpg" />'
							};

							transporter.sendMail(mailOptions, function(error, info){
								if (error) {
									console.log(error);
								} else {
									console.log('Email sent: ' + info.response);
								}
							});

							console.log('Transaction Complete.');
						}
			        });
					connection.release();
				});
			});
		});
	});
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

function getAllCards(){
	return new builder.Message()
    .attachmentLayout(builder.AttachmentLayout.carousel)
    .attachments([
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