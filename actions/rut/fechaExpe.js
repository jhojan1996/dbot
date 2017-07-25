var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "¿Cual es la fecha de expedición de su documento de identidad? Comience con el año, luego el mes y por ultimo el dia seperados por guiones, por ejemplo: AAAA-MM-DD");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];