var builder = require('botbuilder');
var util = require('util');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var pdf = require('pdfkit');
var fs = require('fs');
var blobStream = require('blob-stream');
var download = require('download-file');

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

var doc = new pdf;

module.exports = [
	//Tipo documento
	function(session){
		console.log("Inicio crear rut");
		var idUsuario = session.userData.idUsuario;
		if(idUsuario){
			console.log("Tiene idusuario");
			session.send("Usted ya esta registrado en el sistema, a continuación las operaciones que puedes hacer");
			var msg = getHelpCards();
			session.endDialog(msg);
		}else{
			session.dialogData.crearRut = true;
			session.send('Claro. Te ayudare a crear el RUT, por favor dame la siguiente información:');
			session.beginDialog('RutCambiarTipoDoc');
		}		
	},
	function(session, results){
		console.log("Tipo documento -----------> ",results.response);
		session.dialogData.tipoDocumento = results.response;
		session.beginDialog('RutCambiarNumeroDocumento');
	},
	
	function(session,results){
		session.dialogData.numeroDocumento = results.response;
		session.beginDialog('RutCambiarFechaExpe');
	},
	function(session, results){
		session.dialogData.fechaExpe = results.response;
		session.beginDialog('RutCambiarPaisExpe');
	},
	function(session, results){
		session.dialogData.paisExpe = results.response;
		session.beginDialog('RutCambiarDptoExpe');
	},
	function(session, results) {
		session.dialogData.dptoExpe = results.response;
		session.beginDialog('RutCambiarMpioExpe');
	},
	function(session, results) {
		session.dialogData.mpioExpe = results.response;
		session.beginDialog('RutCambiarApellido1');
	},
	function(session, results) {
		session.dialogData.apellido1 = results.response;
		session.beginDialog('RutCambiarApellido2');
	},
	function(session, results) {
		session.dialogData.apellido2 = results.response;
		session.beginDialog('RutCambiarNombre1');
	},
	function(session, results) {
		session.dialogData.nombre1 = results.response;
		session.beginDialog('RutCambiarNombre2');
	},
	function(session, results) {
		session.dialogData.nombre2 = results.response;
		session.beginDialog('RutCambiarPaisUbi');
	},
	function(session, results) {
		session.dialogData.paisUbi = results.response;
		session.beginDialog('RutCambiarDptoUbi');
	},
	function(session, results) {
		session.dialogData.dptoUbi = results.response;
		session.beginDialog('RutCambiarMpioUbi');
	},
	function(session, results) {
		session.dialogData.mpioUbi = results.response;
		session.beginDialog('RutCambiarDireccion');
	},
	function(session, results) {
		session.dialogData.direccion = results.response;
		session.beginDialog('RutCambiarEmail');
	},
	function(session, results) {
		session.dialogData.email = results.response;
		session.beginDialog('RutCambiarPostal');
	},
	function(session, results) {
		session.dialogData.postal = results.response;
		session.beginDialog('RutCambiarTelefono1');
	},
	function(session, results) {
		session.dialogData.telefono1 = results.response;
		session.beginDialog('RutCambiarTelefono2');
	},
	function(session, results) {
		session.dialogData.telefono2 = results.response;
		session.beginDialog('RutCambiarActPrinc');
	},
	function(session, results) {
		session.dialogData.actPrinc = results.response;
		session.beginDialog('RutCambiarActSecun');
	},
	function(session, results) {
		session.dialogData.actSecun = results.response;
		session.beginDialog('RutCambiarOtrasAct');
	},
	function(session, results) {
		session.dialogData.otrasAct = results.response;
		session.beginDialog('RutCambiarOcupacion');
	},
	function(session, results) {
		session.dialogData.ocupacion = results.response;
		session.beginDialog('RutCambiarResponsabilidad');
	},
	function(session, results) {
		session.dialogData.responsabilidad = results.response;

		let message = new builder.Message(session)
	    .text("Tu RUT fue creado con exito. A tu correo te llegara la información con la cual podras ingresar al sistema. ¿En que mas te puedo ayudar?")
	    .sourceEvent({
	        facebook: {
	            "quick_replies": [
	                {
	                    "content_type": "text",
	                    "title": "Ingresar al sistema",
	                    "payload": "login"
	                },
	                {
	                    "content_type": "text",
	                    "title": "Ayuda",
	                    "payload": "ayuda"
	                }
	            ]
	        }
	    });
		session.send(message);

		insertRut(session);
		
		doc.fontSize('16');
		doc.text("Su RUT fue creado con exito");
		doc.moveDown();
		doc.text("Tipo de documento: "+ session.dialogData.tipoDocumento);
		doc.moveDown();
		doc.text("Número de documento: "+ session.dialogData.numeroDocumento);
		doc.moveDown();
		doc.text("Fecha de expedición: "+ session.dialogData.fechaExpe);
		doc.moveDown();
		doc.text("País de expedición: "+ session.dialogData.paisExpe);
		doc.moveDown();
		doc.text("Departamento de expedición: "+ session.dialogData.dptoExpe);
		doc.moveDown();
		doc.text("Municipio de expedición: "+ session.dialogData.mpioExpe);
		doc.moveDown();
		doc.text("Primer apellido: "+ session.dialogData.apellido1);
		doc.moveDown();
		doc.text("Segundo apellido: "+ session.dialogData.apellido2);
		doc.moveDown();
		doc.text("Primer nombre: "+ session.dialogData.nombre1);
		doc.moveDown();
		doc.text("Sergundo nombre: "+ session.dialogData.nombre2);
		doc.moveDown();
		doc.text("País de residencia: "+ session.dialogData.paisUbi);
		doc.moveDown();
		doc.text("Departamento de residencia: "+ session.dialogData.dptoUbi);
		doc.moveDown();
		doc.text("Municipio de residencia: "+ session.dialogData.mpioUbi);
		doc.moveDown();
		doc.text("Direccion: "+ session.dialogData.direccion);
		doc.moveDown();
		doc.text("Email: "+ session.dialogData.email);
		doc.moveDown();
		doc.text("Codigo postal: "+ session.dialogData.postal);
		doc.moveDown();
		doc.text("Primer número de teléfono: "+ session.dialogData.telefono1);
		doc.moveDown();
		doc.text("Sergundo número de teléfono: "+ session.dialogData.telefono2);
		doc.moveDown();
		doc.text("Actividad principal: "+ session.dialogData.actPrinc);
		doc.moveDown();
		doc.text("Actividad secundaria: "+session.dialogData.actSecun);
		doc.moveDown();
		doc.text("Otras actividades: "+ session.dialogData.otrasAct);
		doc.moveDown();
		doc.text("Ocupación: "+ session.dialogData.ocupacion);
		doc.moveDown();
		doc.text("Responsabilidades: "+ session.dialogData.responsabilidad);

		doc.end();
	}
];


function insertRut(session){
	console.log(session.dialogData);
	pool.getConnection(function(err, connection){
		connection.beginTransaction(function(err){
			connection.query('INSERT INTO usuario (nombre1,nombre2,apellido1,apellido2,direccion,telefono1,telefono2,email,cod_postal) VALUES (?,?,?,?,?,?,?,?,?)', [session.dialogData.nombre1, session.dialogData.nombre2, session.dialogData.apellido1, session.dialogData.apellido2, session.dialogData.direccion, session.dialogData.telefono1, session.dialogData.telefono2, session.dialogData.email, session.dialogData.postal], function(err, result) {
				console.log("ERROR: ----------------> "+err+" ||| RESULT ------------>:"+result);
				if (err) { 
					connection.rollback(function() {
						console.log("ERROR 2------------->",err)
						return err;
					});
				}

				var log = result.insertId;

				console.log(log);

				var tipo_documento = (typeof session.dialogData.tipoDocumento.entity === 'undefined')?session.dialogData.tipoDocumento:session.dialogData.tipoDocumento.entity;

				connection.query('INSERT INTO detalle_usuario (id_usuario, tipo_documento, documento, fecha_exp, pais_exp, dpto_exp, mpio_exp, pais_ubi, dpto_ubi, mpio_ubi) VALUES (?,?,?,?,?,?,?,?,?,?)', [log, tipo_documento, session.dialogData.numeroDocumento, session.dialogData.fechaExpe, session.dialogData.paisExpe, session.dialogData.dptoExpe, session.dialogData.mpioExpe, session.dialogData.paisUbi, session.dialogData.dptoUbi, session.dialogData.mpioUbi], function(err, result) {
					console.log("ERROR 3-------------->",err);
					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}
				});

				console.log("PASE EL ERROR 3");

				var cod_rut = Math.floor(Math.random() * 1000000000);

				connection.query('INSERT INTO rut (cod_rut, act_principal, act_secundaria, otr_act, ocupacion, responsabilidades, id_usuario) VALUES (?,?,?,?,?,?,?)', [cod_rut, session.dialogData.actPrinc, session.dialogData.actSecun, session.dialogData.otrasAct, session.dialogData.ocupacion, session.dialogData.responsabilidad, log], function(err, result) {
					console.log("ERROR 4-------------->",err);
					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}
				});

				console.log("PASE EL ERROR 4");

				var rndm = Math.floor(Math.random() * 100);
				var password
				var username = session.dialogData.nombre1.toLowerCase();
				var password = session.dialogData.nombre1+"2017";

				connection.query('INSERT INTO registro (id_usuario, username, password) VALUES (?,?,?)', [log, username, password], function(err, result) {
					console.log("ERROR 5-------------->",err);
					if (err) { 
						connection.rollback(function() {
							throw err;
						});
					}  

					console.log("PASE EL ERROR 5");
					connection.commit(function(err) {
						if (err) { 
							connection.rollback(function() {
								throw err;
							});
						}
						var mailOptions = {
							from: 'jhojanestiven1996@gmail.com',
							to: session.dialogData.email,
							subject: 'Creacion de RUT',
							html: 'Señor(a) '+session.dialogData.nombre1+' '+session.dialogData.apellido1+', su RUT a sido creado con exito.<br/><b>Su usuario es: '+username+'</b><br/>Su contraseña es: '+password
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('Email sent: ' + info.response);
							}
						});

						console.log('Transaction Complete.');
						connection.release();
					});
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