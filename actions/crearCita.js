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

module.exports = [
	function(session){
		console.log("Inicia accion para crear citas");
		session.dialogData.crearCita = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para agendar una cita debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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

		insertRut(session);

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

function insertCita(session){
	console.log("DATOS PARA EL INSTER EN CITAS------------------->",session.dialogData);

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
		var idUsuario = session.userData.idUsuario;
		connection.query('INSERT INTO cita (id_usuario,f_solicitud,h_solicitud,f_cita,h_cita,lugar) VALUES (?,?,?,?,?,?)', [idUsuario, session.dialogData.fechaSol, session.dialogData.horaSol, session.dialogData.fechaSol, session.dialogData.horaSol, session.dialogData.lugarCita], function(err, result) {
			console.log("ERROR: ----------------> "+err+" ||| RESULT ------------>:"+result);
			if (err) { 
				connection.rollback(function() {
					console.log("ERROR 2------------->",err)
					return err;
				});
			}

			var log = result.insertId;

			console.log("ULTIMO ID INSERTADO EN CITAS--------------->",log);
		});
	});
	/* End transaction */
}