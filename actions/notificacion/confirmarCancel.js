var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.choice(session, "¿Seguro que desea cancelar su suscripción al servicio de notificaciones?","Si|No", "No pude entender lo que me dijiste. Escribe cual es el lugar de la cita.");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];