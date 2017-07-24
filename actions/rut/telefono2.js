var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Dime tu número telefonico secundario");
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];