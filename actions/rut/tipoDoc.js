var builder = require('botbuilder');

module.exports = [
	function (session) {
		var options = session.localizer.gettext(session.preferredLocale(), "es");
		console.log("Ingresar tipo de documento ---- crear rut");
        builder.Prompts.choice(session, "Dime tu tipo de documento","Cédula|Tarjeta de identidad|Cedula extrangeria", "No pude entender lo que dijiste!");
    },
    function (session, results) {
    	console.log("Tipo doc ----> ",results);
        session.endDialogWithResult(results);
    }
];