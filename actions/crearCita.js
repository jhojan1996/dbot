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
		console.log("Inicia accion para crear citas");
		session.dialogData.crearCita = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para agendar una cita debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te mostraré las acciones que puedes realizar:");
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
			session.send("Claro. te ayudare a agendar una cita");
			session.beginDialog("CrearCitaFechaSol");
		}
	},
	function(session, result){
		session.dialogData.fechaSol = result.response;
		session.beginDialog("CrearCitaHoraSol");
	},
	function(session, result){
		session.dialogData.horaSol = result.response;
		session.beginDialog("CrearCitaLugarCita");
	},
	function(session, result){
		session.dialogData.lugarCita = result.response;
		console.log("DATOS DE LA CITA-------------->",session.dialogData);

		insertCita(session);

		session.send("Su cita fue agendada exitosamente:");
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

function insertCita(session){
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
			connection.query('INSERT INTO cita (id_usuario,f_solicitud,h_solicitud,f_cita,h_cita,lugar) VALUES (?,?,?,?,?,?)', [idUsuario, fechaSol, horaSol, fechaSol, horaSol, lugarCita], function(err, result) {
				console.log("ERROR: ----------------> "+err+" ||| RESULT ------------>:"+result);
				if (err) { 
					console.log("ERROR 2:------------>",err);
					connection.rollback(function() {
						console.log("ERROR 3------------->",err)
						return err;
					});
				}

				var log = result.insertId;

				console.log("ULTIMO ID INSERTADO EN CITAS--------------->",log);

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
								subject: 'Creacion de cita',
								html: '<h1>su cita fue agendada con exito<h1><br/><b>Fecha: '+fechaSol+'</b><br/><b>Hora: '+horaSol+'</b><br/><b>Lugar: '+lugarCita+'</b>'
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