var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.choice(session, "Por favor selecciona el lugar de la cita:","Medellín|Bogotá|Cali", "No pude entender lo que me dijiste. Escribe cual es el lugar de la cita.");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];