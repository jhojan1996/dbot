var builder = require('botbuilder');

module.exports = [
	function (session) {
		console.log("Ingresar tipo de documento ---- crear rut");
        builder.Prompts.text(session, "Por favor dime tu tipo de documento, por ejemplo: Cédula");
    },
    function (session, results) {
    	console.log("Tipo doc ----> ",results);
        session.endDialogWithResult(results);
    }
];