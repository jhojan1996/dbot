var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor dime un primer número telefonico");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];