var builder = require('botbuilder');
var schedule = require('node-schedule');
var mysql = require('mysql');

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

var pool = mysql.createPool({
	connectionLimit : 10,
    host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user     : 'bdfb18a7b2c383',
    password : '669f8c04',
    database : 'dibot'
});

module.exports = [
	function(session){
		console.log("Inicia accion para notificaciones");
		session.dialogData.notificar = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para suscribirse al servicio de notificaciones debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te mostraré las acciones que puedes realizar:");
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
			session.send("Claro. te ayudare a suscribirte al servicio");
			session.beginDialog("HoraNotificacion");
		}
	},
	function(session, result){
		session.dialogData.horaNoti = result.response;
		console.log("DATOS DE LA NOTIFICACION-------------->",session.dialogData);

		programarNoti(session);

		session.endDialog("Su suscripción al servicio de notificaciones fue realizada correctamente.");
	}
];

function programarNoti(session){
	var event = schedule.scheduleJob("notificar", "*/5 * * * *", function() {
		console.log('This runs every 5 minute');
		var currentDate = new Date();
		var nMonth = currentDate.getMonth();
		var consulta;
		var idUsuario = session.userData.idUsuario;
		var address = session.message.address;
		var documento;

		pool.getConnection(function(err, connection){
			connection.query('SELECT documento FROM detalle_usuario WHERE id_usuario = ?',idUsuario, function(err, rows){
				console.log("ERROR 1--------->", err);
				if(err) throw err;
				console.log("RESULT ROWS----->", rows);
				if (rows.length > 0){
					documento = rows[0].documento;
					var lastChar = documento.substr(documento.length-1);
	            	var cuatrimestre;
	            	if(nMonth >= 0 && nMonth <= 3){
						cuatrimestre = "1";
					}else if(nMonth > 3 && nMonth <= 7){
						cuatrimestre = "2";
					}else{
						cuatrimestre = "3";
					}

					connection.query("SELECT cuatrimestre"+cuatrimestre+" FROM declaracion WHERE ult_digito = ?", lastChar, function(err,rows){
						console.log("ERROR 2---->",err);
		        		if (err) throw err;
		        		console.log("ERROR 3---->",err);
		        		 if(cuatrimestre === "1"){
				        	var msg = new builder.Message().address(address);
						    msg.text("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA en la fecha "+rows[0].cuatrimestre1);
						    msg.textLocale('es-ES');
						    bot.send(msg);
				        }else if(cuatrimestre === "2"){
				        	var msg = new builder.Message().address(address);
						    msg.text("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA en la fecha "+rows[0].cuatrimestre2);
						    msg.textLocale('es-ES');
						    bot.send(msg);
				        }else{
				        	var msg = new builder.Message().address(address);
						    msg.text("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA en la fecha "+rows[0].cuatrimestre3);
						    msg.textLocale('es-ES');
						    bot.send(msg);
				        }
				        connection.release();
					});
				}
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
