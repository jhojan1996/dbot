var builder = require('botbuilder');
var restify = require('restify');


//configura el servidor tipo restify
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Crea el nuevo bot y configura la escucha de mensajes
// Las variables de entorno ".env" se cargan desde azure
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    Rut: 'Crear rut',
    Citas: 'Agendar una cita',
    Login: 'Ingresar al sistema',
    Ayuda: 'Solicitar ayuda'
};

//Este dialogo es para intent por defecto
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// Aquí instanciamos a LUIS
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Ayuda', function(session){
        console.log("Entre a la ayuda!");
        session.endDialog("Hola! Soy DiBot. A continuacion te mostrare las acciones en las que puedo ayudar: ");
});
bot.dialog('CrearRut', require('./actions/crearRut'));
bot.dialog('GestionarRut', require('./actions/gestionarRut'));
bot.dialog('Login', require('./actions/login'));
bot.dialog('CrearCita', require('./actions/crearCita'));

bot.on('error', function (e) {
    console.log('And error ocurred', e);
});