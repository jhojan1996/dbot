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

var connection = mysql.createConnection({
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
		if(isValidDate(result.response)){
			session.beginDialog('RutCambiarPaisExpe');
		}else{
			session.send("La fecha que ingresaste no es valida.");
			session.beginDialog('RutCambiarFechaExpe');
		}
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

	connection.connect(function(err) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		console.log('connected as id ' + connection.threadId);
	});

	/* Begin transaction */
	connection.beginTransaction(function(err) {
		if (err) {
			console.log("ERROR 1-------->",err); 
			throw err; 
		}
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
			var username = session.dialogData.nombre1+session.dialogData.nombre2+rndm
			var password = Math.floor(Math.random() * 10000000);

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
						html: '<h1>su rut fue creado con exito<h1><br/><b>Usuario: '+username+'</b><br/>Contraseña: '+password
					};

					transporter.sendMail(mailOptions, function(error, info){
						if (error) {
							console.log(error);
						} else {
							console.log('Email sent: ' + info.response);
						}
					});

					console.log('Transaction Complete.');
					connection.end();
				});
			});
		});
	});
	/* End transaction */
}

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
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
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Formalizar el RUT",
                "subtitle": "Quiero formalizar mi RUT",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Formalizar+RUT&w=500&h=260"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Actualizar el RUT",
                "subtitle": "Quiero actualizar mi RUT",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Actualizar+RUT&w=500&h=260"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Notificaciones",
                "subtitle": "Quiero subscribirme al servicio de notificaciones",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Notificaciones&w=500&h=260"
                  }
                ]
            }
        },
        {
            "contentType": "application/vnd.microsoft.card.hero",
            "content": {
                "title": "Agendar citas",
                "subtitle": "Quiero agendar una cita",
                "images": [
                  {
                    "url": "https://placeholdit.imgix.net/~text?txtsize=35&txt=Agendar+citas&w=500&h=260"
                  }
                ]
            }
        }
    ]);
}