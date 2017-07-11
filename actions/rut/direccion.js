var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime tu dirección de residencia");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];