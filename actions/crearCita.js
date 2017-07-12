var builder = require('botbuilder');

module.exports = [
	function(session){
		console.log("Inicia accion para crear citas");
		session.dialogData.crearCita = true;
		session.send("Claro. te ayudare a agendar una cita");
		session.beginDialog("CrearCitaFechaSol");
	},
	function(session, result){
		session.dialogData.fechaSol = result.response;
		session.beginDialog("CrearCitaHoraSol");
	},
	function(session, result){
		session.dialogData.horaSol = result.response;
		session.beginDialog("CrearCitaLugarCita");
	},
	function(session, result){
		session.dialogData.lugarCita = result.response;
		session.send("Su cita fue agendada con exito con los siguientes dato: ");
		session.send("Fecha de la cita: "+session.dialogData.fechaSol);
		session.send("Hora de la cita: "+session.dialogData.horaSol);
		session.send("Lugar de la cita: "+session.dialogData.lugarCita);
		session.endDialog();
	}
];