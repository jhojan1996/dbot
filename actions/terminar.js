var builder = require('botbuilder');

module.exports = function(session){
		console.log("Entre a la terminar!");
    session.send("Fue un placer haber hablado contigo!");
		session.endDialog();
};