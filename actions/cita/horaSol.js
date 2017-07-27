var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa la hora en la que deseas la cita. Por favor utiliza el formato: HH:MM");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];