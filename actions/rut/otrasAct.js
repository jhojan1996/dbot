var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa el codigo de otra actividad que realices");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];