var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa la fecha en la que deseas la cita en formato: AAAA-MM-DD");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];