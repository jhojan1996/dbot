var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.number(session, "Por favor ingresa el codigo de tus responsabilidades, calidades y atributos");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];