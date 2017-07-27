var builder = require('botbuilder');

module.exports = [
	function (session) {
        builder.Prompts.text(session, "Por favor ingresa la fecha en la que deseas la cita. Utiliza el formato: AAAA-MM-DD");
    },
    function (session, results) {
    	if(isValidDate(results.response)){
			session.endDialogWithResult(results);
		}else{
			session.send("La fecha que ingresaste no es valida.");
			session.replaceDialog('CrearCitaFechaSol', { reprompt: true });
		}
    }
];

function isValidDate(dateString) {
  	var regEx = /^\d{4}-\d{2}-\d{2}$/;
  	return dateString.match(regEx) != null;
}