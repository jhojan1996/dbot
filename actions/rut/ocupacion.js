var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa el codigo de tu ocupación");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];