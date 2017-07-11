// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Ayuda', require('./actions/ayuda')).triggerAction({
    matches: 'Ayuda',
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});
//bot.dialog('Ingresar', require('./actions/login')).triggerAction({matches: 'Ingresar'});
bot.dialog('CrearRut', require('./actions/crearRut')).triggerAction({
    matches: 'CrearRut',
    confirmPrompt: "Si escribes esto los datos que has ingresado de perderan. Deseas continuar?"
});
//bot.dialog('GestionarRut', require('./actions/gestionarRut')).triggerAction({matches: 'GestionarRut'});
//bot.dialog('CrearCita', require('./actions/crearCita')).triggerAction({matches: 'CrearCita'});

//Acciones para cambiar de contexto en creacion de RUT//
bot.dialog('RutCambiarTipoDoc', require('./actions/rut/tipoDoc'));

bot.dialog('RutCambiarNumeroDocumento', require('./actions/rut/numDoc'));
bot.dialog('RutCambiarFechaExpe', require('./actions/rut/fechaExpe'));

bot.dialog('RutCambiarPaisExpe', require('./actions/rut/paisExpe'));

bot.dialog('RutCambiarDptoExpe', require('./actions/rut/dptoExpe'));

bot.dialog('RutCambiarMpioExpe', require('./actions/rut/mpioExpe'));

bot.dialog('RutCambiarApellido1', require('./actions/rut/apellido1'));

bot.dialog('RutCambiarApellido2', require('./actions/rut/apellido2'));

bot.dialog('RutCambiarNombre1', require('./actions/rut/nombre1'));

bot.dialog('RutCambiarNombre2', require('./actions/rut/nombre2'));

bot.dialog('RutCambiarPaisUbi', require('./actions/rut/paisUbi'));

bot.dialog('RutCambiarDptoUbi', require('./actions/rut/dptoUbi'));

bot.dialog('RutCambiarMpioUbi', require('./actions/rut/mpioUbi'));

bot.dialog('RutCambiarDireccion', require('./actions/rut/direccion'));

bot.dialog('RutCambiarEmail', require('./actions/rut/email'));

bot.dialog('RutCambiarPostal', require('./actions/rut/postal'));

bot.dialog('RutCambiarTelefono1', require('./actions/rut/telefono1'));

bot.dialog('RutCambiarTelefono2', require('./actions/rut/telefono2'));

bot.dialog('RutCambiarActPrinc', require('./actions/rut/actPrinc'));

bot.dialog('RutCambiarActSecun', require('./actions/rut/actSecun'));

bot.dialog('RutCambiarOtrasAct', require('./actions/rut/otrasAct'));

bot.dialog('RutCambiarOcupacion', require('./actions/rut/ocupacion'));

bot.dialog('RutCambiarResponsabilidad', require('./actions/rut/responsabilidad'));
//------------------------------------------------------------------//