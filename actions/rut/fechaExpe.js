var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime la fecha de expedición del documento de identidad en el siguiente formato: AAAA-MM-DD.");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];