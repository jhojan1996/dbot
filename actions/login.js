var builder = require('botbuilder');

module.exports = function(session){
	console.log("Entre a la acción login!");
	session.send("Para ingesar al sistema por favor presiona el boton login");
	var message = new builder.Message(session)
      .sourceEvent({
        facebook: {
          attachment: {
            type: 'template',
            payload: {
              template_type: 'generic',
              elements: [{
                title: 'Ingresar al sistema (necesita tener el RUT creado).',
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
	session.endDialog(message);
};

