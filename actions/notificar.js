var builder = require('botbuilder');
var schedule = require('node-schedule');

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
	var event = schedule.scheduleJob("*/1 * * * *", function() {
        console.log('This runs every 5 minute');
    });
}