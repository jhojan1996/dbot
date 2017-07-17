var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.number(session, "Por favor ingresa el codigo de tu actividad principal");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];