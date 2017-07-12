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
};

