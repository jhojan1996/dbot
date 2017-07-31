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
		console.log("Inicia accion para cancelar citas");
		session.dialogData.crearCita = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para cancelar una cita debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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
			session.send("Claro. te ayudare a cancelar la cita que tienes programada");
			session.beginDialog("SeleccionarCita");
		}
	},
	function(session, result){
		session.dialogData.cancelarCita = result.response;
		console.log("DATOS DE LA CITA A REPORGRAMAR-------------->",session.dialogData);
		var cancel = (typeof session.dialogData.cancelarCita.entity === 'undefined')?session.dialogData.cancelarCita:session.dialogData.cancelarCita.entity;

		if(cancel === 'Si'){
			cancelCita(session);
			session.send("La cita fue cancelada con exito, que mas deseas hacer?");
		}else{
			session.send("La cita no fue cancelada, que mas deseas hacer?");
		}
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

function cancelCita(session){
	console.log("DATOS PARA EL ELIMINAR EN CITAS------------------->",session.dialogData);

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
		connection.query('DELETE FROM cita WHERE id_usuario = ?', idUsuario, function(err, result) {
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
							subject: 'Cancelación de cita',
							html: '<h1>Su cita fue cancelada con exito</h1>'
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