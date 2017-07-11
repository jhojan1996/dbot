var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.number(session, "Por favor dime tu número de documento, por ejemplo: 1036956628");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];