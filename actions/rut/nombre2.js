var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime tu segundo nombre");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];