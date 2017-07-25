var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "¿Cual es la fecha de expedición de su documento de identidad? Comience con el año, luego el mes y por ultimo el dia seperados por guiones, por ejemplo: AAAA-MM-DD");
    },
    function (session, results) {
    	if(isValidDate(results.response)){
			session.endDialogWithResult(results);
		}else{
			session.send("La fecha que ingresaste no es valida.");
			session.replaceDialog('RutCambiarFechaExpe', { reprompt: true });
		}
        
    }
];

function isValidDate(dateString) {
  var regEx = /^\d{4}-\d{2}-\d{2}$/;
  return dateString.match(regEx) != null;
}