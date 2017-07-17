// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var mysql = require('mysql');

// Setup Restify Server
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

//MYSQL credenciales//
var connection = mysql.createConnection({
    host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user     : 'bdfb18a7b2c383',
    password : '669f8c04',
    database : 'dibot'
});
//----------------//


//Codigo para el login//
server.get('/authorize', restify.plugins.queryParser(), function (req, res, next) {
    if (req.query && req.query.redirect_uri && req.query.username && req.query.password) {
        var username = req.query.username;
        var password = req.query.password;
        var id_usuario;

        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });


        connection.query("SELECT id, id_usuario FROM registro WHERE username = ? AND password = ?",[username, password], function(err, result, fields) {
            if (err) throw err;
            console.log("ERROR EN ACCOUNT_LINKING---------->", result);
            console.log("RESULT ACOOUNT_LINKING----------->", result);
            if(result.length > 0){
                console.log("RESULT ACOOUNT_LINKING----------->", result);
                id_usuario = result[0].id_usuario;
                console.log("POSICION 0 RESULT----------->", result[0]);
                console.log("POSICION 0 RESULT CON ID_USUARIO----------->", result[0].id_usuario);
                console.log("VARIABLE ID_USUARIO------------->",id_usuario);
            }
        });

        var redirectUri = req.query.redirect_uri + '&authorization_code=' + id_usuario;
        console.log("REDIRECTURI------------>",redirectUri);
        return res.redirect(redirectUri, next);
    } else {
        return res.send(400, 'Request did not contain redirect_uri and username in the query string');
    }
});

server.get(/\/web\/?.*/, restify.plugins.serveStatic({
  directory: __dirname
}));

//-------------------//

var bot = new builder.UniversalBot(connector);

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.onDefault(function(session){
    var accountLinking = session.message.sourceEvent.account_linking;
    if (accountLinking) {
        // This is the handling for the `Account Linking webhook event` where we could
        // verify the authorization_code and that the linking was successful.
        // The authorization_code is the value we passed above and
        // status has value `linked` in case the linking succeeded.
        var id_usuario = accountLinking.authorization_code;
        console.log("id_usuario ---------------->",id_usuario);
        console.log("accountLinking-------------->",accountLinking);
        var authorizationStatus = accountLinking.status;
        if (authorizationStatus === 'linked') {
            // Persist username under the userData
            session.userData.idUsuario = id_usuario;
            session.endDialog('Ingreso exitoso! dime que mas deseas hacer');
        } else if (authorizationStatus === 'unlinked') {
            // Remove username from the userData
            delete session.userData.idUsuario;
            session.endDialog('Tu cuenta fue desvinculada exitosamente');
        } else {
            session.endDialog('Unknown account linking event received');
        }
    } else {
        var storedUsername = session.userData.idUsuario;
        if (storedUsername) {
            session.endDialog('You are known as ' + storedUsername + ' - type "unlink account" to try out unlinking');
        } else {
            session.endDialog('I hear you - type "link account" to try out account linking');
        }
    }
});

bot.set('localizerSettings', {
    botLocalePath: "./customLocale", 
    defaultLocale: "es" 
});

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
    matches: 'CrearRut'
}).endConversationAction("endCrearRut", "Vale. Cancelado",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si escribes esto los datos que has ingresado de perderan. Deseas continuar?"
});
//bot.dialog('GestionarRut', require('./actions/gestionarRut')).triggerAction({matches: 'GestionarRut'});
//bot.dialog('CrearCita', require('./actions/crearCita')).triggerAction({matches: 'CrearCita'});


//Acciones para cambiar de contexto en creacion de RUT//
bot.dialog('RutCambiarTipoDoc', require('./actions/rut/tipoDoc')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarNumeroDocumento', require('./actions/rut/numDoc')).triggerAction({
    matches: 'CrearRut'
});
bot.dialog('RutCambiarFechaExpe', require('./actions/rut/fechaExpe')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarPaisExpe', require('./actions/rut/paisExpe')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarDptoExpe', require('./actions/rut/dptoExpe')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarMpioExpe', require('./actions/rut/mpioExpe')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarApellido1', require('./actions/rut/apellido1')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarApellido2', require('./actions/rut/apellido2')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarNombre1', require('./actions/rut/nombre1')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarNombre2', require('./actions/rut/nombre2')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarPaisUbi', require('./actions/rut/paisUbi')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarDptoUbi', require('./actions/rut/dptoUbi')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarMpioUbi', require('./actions/rut/mpioUbi')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarDireccion', require('./actions/rut/direccion')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarEmail', require('./actions/rut/email')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarPostal', require('./actions/rut/postal')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarTelefono1', require('./actions/rut/telefono1')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarTelefono2', require('./actions/rut/telefono2')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarActPrinc', require('./actions/rut/actPrinc')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarActSecun', require('./actions/rut/actSecun')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarOtrasAct', require('./actions/rut/otrasAct')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarOcupacion', require('./actions/rut/ocupacion')).triggerAction({
    matches: 'CrearRut'
});

bot.dialog('RutCambiarResponsabilidad', require('./actions/rut/responsabilidad')).triggerAction({
    matches: 'CrearRut'
});
//------------------------------------------------------------------//

//Login//
bot.dialog('Login', require('./actions/login')).triggerAction({
    matches: 'Login'
});

bot.dialog('LogOut', require('./actions/logout')).triggerAction({
    matches: 'LogOut'
});
//-----//

//Agendar cita//
bot.dialog('CrearCita', require('./actions/crearCita')).triggerAction({
    matches: 'CrearCita'
}).endConversationAction("endCrearCita", "Vale. Cancelado",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si escribes esto los datos que has ingresado de perderan. Deseas continuar?"
});

bot.dialog('CrearCitaFechaSol', require('./actions/cita/fechaSol')).triggerAction({
    matches: 'CrearCita'
});

bot.dialog('CrearCitaHoraSol', require('./actions/cita/horaSol')).triggerAction({
    matches: 'CrearCita'
});

bot.dialog('CrearCitaLugarCita', require('./actions/cita/lugarCita')).triggerAction({
    matches: 'CrearCita'
});
//-----------//