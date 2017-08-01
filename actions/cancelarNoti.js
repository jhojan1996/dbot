var builder = require('botbuilder');
var schedule = require('node-schedule');

module.exports = [
	function(session){
		console.log("Inicia accion para cancelar notificaciones");
		session.dialogData.cancelarNoti = true;
		var idUsuario = session.userData.idUsuario;
		if(!idUsuario){
			console.log("No tiene idusuario");
			session.send("Para cancelar la suscripción a notificaciones debe ingresar al sistema, si no tiene usuario y contraseña por favor cree el RUT. A continuación te pondre las acciones que puedes realizar");
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
		    session.send(message);
			session.send("Para crear el rut presione en siguiente botón: ");
			var msg = getHelpCards();			
			session.endDialog(msg);
		}else{
			console.log("Tiene ingreso en el sistema");
			session.beginDialog("ConfirmarCancel");
		}
	},
	function(session, result){
		session.dialogData.confirmarCancel = result.response;
		console.log("DATOS DE LA CANCELACION-------------->",session.dialogData);
		var cancel = (typeof session.dialogData.confirmarCancel.entity === 'undefined')?session.dialogData.confirmarCancel:session.dialogData.confirmarCancel.entity;

		if(cancel === 'Si'){
			cancelNoti(session);
			session.send("La suscripción fue cancelada con exito, ¿qué más deseas hacer?");
		}else{
			session.send("La suscripción no fue cancelada, ¿qué más deseas hacer?");
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

function cancelNoti(session){
	var cancelJob = schedule.scheduledJobs["notificar"];
	cancelJob.cancel();
}