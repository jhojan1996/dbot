var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime tu correo electronico, por ejemplo: prueba@correo.com");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];