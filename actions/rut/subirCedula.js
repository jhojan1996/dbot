var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.attachment(session, "Por favor adjunta una imagen con tu cedula");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];