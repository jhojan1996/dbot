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
var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for search option
        builder.Prompts.choice(
            session,
            'Hola! Soy DiBot. dime, ¿Qué deseas hacer?',
            [DialogLabels.Ayuda, DialogLabels.Rut, DialogLabels.Login, DialogLabels.Citas],
            {
                maxRetries: 3,
                retryPrompt: 'Por favor escoge o escribe una de las opciones'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Lo siento! No pude atender tu solicitud. Pero no te preocupes, puede escribirlo de nuevo!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Error interno, si persiste envie un e-mail a xxx@xxx.com con el siguiente mensaje: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.Ayuda:
                console.log("Ayuda action");
                return session.beginDialog('ayuda');
            case DialogLabels.Rut:
                console.log("Rut action");
                return session.beginDialog('CrearRut');
            case DialogLabels.Login:
                console.log("Login action");
            	return session.beginDialog('login');
            case DialogLabels.Citas:
                console.log("Citas action");
            	return session.beginDialog('citas');
        }
    }
]);

// Aquí instanciamos a LUIS
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Ayuda', require('./actions/ayuda'));
bot.dialog('CrearRut', require('./actions/crearRut'));
bot.dialog('GestionarRut', require('./actions/gestionarRut'));
bot.dialog('Login', require('./actions/login'));
bot.dialog('CrearCita', require('./actions/crearCita'));

bot.on('error', function (e) {
    console.log('And error ocurred', e);
});