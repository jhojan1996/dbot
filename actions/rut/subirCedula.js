var builder = require('botbuilder');

module.exports = [
	function (session) {
		var msg = new builder.Message(session)
        .attachments([{
            contentType: "image/png",
            contentUrl: "http://dibot.azurewebsites.net/images/tuto.png"
        }]);
        builder.Prompts.attachment(session, "Por favor adjunta una imagen con tu cedula. Para adjuntar una imagen debes precionar el botón que se muestra en la siguiente imagen: ");
        session.send(msg);
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];