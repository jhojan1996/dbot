var builder = require('botbuilder');

module.exports = [
	function (session) {
		var options = session.localizer.gettext(session.preferredLocale(), "es");
		console.log("Ingresar tipo de documento ---- crear rut");
        builder.Prompts.text(session, "Por favor dime tu tipo de documento, por ejemplo: Cédula",options);
    },
    function (session, results) {
    	console.log("Tipo doc ----> ",results);
        session.endDialogWithResult(results);
    }
];