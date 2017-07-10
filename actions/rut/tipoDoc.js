var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime tu tipo de documento, por ejemplo: Cédula");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];