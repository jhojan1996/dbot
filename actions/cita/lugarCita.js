var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa el lugar de la cita");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];