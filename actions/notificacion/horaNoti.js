var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.choice(session, "Por favor selecciona la hora a la que desea que te llegue la notififación:","7 AM|9 AM|1 PM|4 PM|8 PM", "No pude entender lo que me dijiste. Escribe cual es el lugar de la cita.");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];