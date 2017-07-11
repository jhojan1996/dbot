var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime tu segundo apellido");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];