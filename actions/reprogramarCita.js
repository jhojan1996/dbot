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
		console.log("Inicia accion para reprogramar citas");
		session.dialogData.crearCita = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para reprogramar una cita debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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
			session.send("Claro. te ayudare a reprogramar la cita.");
			session.beginDialog("ReprogFecha");
		}
	},
	function(session, result){
		session.dialogData.fechaSol = result.response;
		session.beginDialog("ReprogHora");
	},
	function(session, result){
		session.dialogData.horaSol = result.response;
		session.beginDialog("ReprogLugar");
	},
	function(session, result){
		session.dialogData.lugarCita = result.response;
		console.log("DATOS DE LA CITA A REPORGRAMAR-------------->",session.dialogData);

		reporgCita(session);

		var lcita = (typeof session.dialogData.lugarCita.entity === 'undefined')?session.dialogData.lugarCita:session.dialogData.lugarCita.entity;

		session.send("Su cita fue agendada con exito con los siguientes dato: ");
		session.send("Fecha de la cita: "+session.dialogData.fechaSol);
		session.send("Hora de la cita: "+session.dialogData.horaSol);
		session.send("Lugar de la cita: "+lcita);
		session.send("¿En qué más te puedo ayudar?");
		var msj = getAllCards();
		session.endDialog(msj);
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

function reporgCita(session){
	console.log("DATOS PARA EL INSTER EN CITAS------------------->",session.dialogData);

	var fechaSol = session.dialogData.fechaSol;
	var horaSol = session.dialogData.horaSol;
	var lugarCita = (typeof session.dialogData.lugarCita.entity === 'undefined')?session.dialogData.lugarCita:session.dialogData.lugarCita.entity;
	pool.getConnection(function(err, connection){
		connection.beginTransaction(function(err) {
			if (err) {
				console.log("ERROR 1-------->",err); 
				throw err; 
			}
			var idUsuario = session.userData.idUsuario;
			console.log(session.userData);
			connection.query('UPDATE cita SET f_cita = ?, h_cita = ?, lugar = ? WHERE id_usuario = ?', [fechaSol, horaSol, lugarCita, idUsuario], function(err, result) {
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
								subject: 'Reprogramar cita',
								html: '<h1>Su cita fue reprogramada con exito, a cotinuacion los datos<h1><br/><b>Fecha: '+fechaSol+'</b><br/><b>Hora: '+horaSol+'</b><br/><b>Lugar: '+lugarCita+'</b>'
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