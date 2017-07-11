var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime el municipio de expedición del documento de identidad");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];