var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.number(session, "Por favor ingresa el codigo de tu actividad secundaria");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];