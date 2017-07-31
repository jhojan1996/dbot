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

module.exports = [
	function(session){
		console.log("Inicia accion para reprogramar citas");
		session.dialogData.crearCita = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para reprogramar una cita debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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

		session.send("Su cita fue agendada con exito con los siguientes dato: ");
		session.send("Fecha de la cita: "+session.dialogData.fechaSol);
		session.send("Hora de la cita: "+session.dialogData.horaSol);
		session.send("Lugar de la cita: "+session.dialogData.lugarCita);
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
        }
    ]);
}

function reporgCita(session){
	console.log("DATOS PARA EL INSTER EN CITAS------------------->",session.dialogData);

	var fechaSol = session.dialogData.fechaSol;
	var horaSol = session.dialogData.horaSol;
	var lugarCita = session.dialogData.lugarCita;
	/* Begin transaction */
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
				connection.end();
			});
		});


	});
	/* End transaction */
}