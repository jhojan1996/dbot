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

var connection = mysql.createConnection({
	host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
	user     : 'bdfb18a7b2c383',
	password : '669f8c04',
	database : 'dibot'
});
connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

module.exports = [
	function(session){
		console.log("Inicia accion para formalizar rut");
		session.dialogData.formalizarRut = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para formalizar el RUT debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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
			session.endDialog("Tu imagen fue guardada con exito y sera enviada a revision, cuando termine el proceso te enviaremos un correo con el resultado de la formalización.");
		}else{
			session.endDialog("El archivo adjunto no es valido. Recuerda que debe ser una imagen. Por favor intentalo de nuevo");
		}
	}
];


function updateRut(session){
	console.log("DATOS PARA EL UPDATE EN RUT------------------>",session.dialogData);

	var archivoSubido = session.dialogData.archivoSubido;
	var idUsuario = session.userData.idUsuario;
	/* Begin transaction */
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
							html: 'Su solicitud de formalización del RUT ha iniciado.<br/>La imagen que hemos recibido de su documento de identificación es la siguiente: <img src="'+archivoSubido+'" /><br/>Proximamente le notificaremos por este mismo medio si el proceso termino exitosamente.<br/><br/>Atentamente,<br/>Asistente tributario.<br/><img src="http://dibot.azurewebsites.net/images/dibot.png" width="100px" /><br/>Un desarrollo de Innovati centro de innovación. www.innovati.com.co<br/><img src="http://dibot.azurewebsites.net/images/logo_innovati.jpg" />'
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