var builder = require('botbuilder');
var schedule = require('node-schedule');
var mysql = require('mysql');

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
		console.log("Inicia accion para notificaciones");
		session.dialogData.notificar = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para suscribirse al servicio de notificaciones debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te mostraré las acciones que puedes realizar:");
			session.send("Para crear el rut presione en siguiente boton: ");
			var msg = getHelpCards();
			session.send(msg);
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
	var currentDate = new Date();
	var nMonth = currentDate.getMonth();
	var consulta;
	var idUsuario = session.userData.idUsuario;

	connection.beginTransaction(function(err) {
		if (err) {
			console.log("ERROR 1-------->",err); 
			throw err; 
		}
		
		connection.query('SELECT documento FROM detalle_usuario WHERE id_usuario = ?', idUsuario, function(err, result) {
			console.log("ERROR: ----------------> "+err+" ||| RESULT ------------>:"+result);
			if (err) { 
				console.log("ERROR 2:------------>",err);
				throw err;
			}
			if(result.length > 0){
	            console.log("RESULT DOCUMENTO----------->", result);
	            documento = result[0].documento;
	            var lastChar = documento.substr(documento.length-1);
	            var cuatrimestre;
	            if(nMonth >= 0 && nMonth <= 3){
					cuatrimestre = "1";
				}else if(nMonth > 3 && nMonth <= 7){
					cuatrimestre = "2";
				}else{
					cuatrimestre = "3";
				}
				connection.query("SELECT cuatrimestre"+cuatrimestre+" FROM declaracion WHERE ult_digito = ?",lastChar, function(err, result, fields) {
	            	console.log("ERROR SEGUNDO QUERY---->",err);
	        		if (err) throw err;
	            	var event = schedule.scheduleJob("*/5 * * * *", function() {
				        console.log('This runs every 5 minute');
				        if(cuatrimestre === "1"){
				        	session.endDialog("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA el "+result[0].cuatrimestre1)
				        }else if(cuatrimestre === "2"){
				        	session.endDialog("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA el "+result[0].cuatrimestre2)
				        }else{
				        	session.endDialog("Recuerde que debe realizar el pago de declaracion cuatrimestral de IVA el "+result[0].cuatrimestre3)
				        }
				    });
	            });
			}
				
			connection.end();
		});
	});
}