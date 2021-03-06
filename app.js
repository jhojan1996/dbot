// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var mysql = require('mysql');
var request = require('request');
var schedule = require('node-schedule');


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
var pool = mysql.createPool({
    connectionLimit : 10,
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
        pool.getConnection(function(err, connection){
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
                    var redirectUri = req.query.redirect_uri + '&authorization_code=' + id_usuario;
                    console.log("REDIRECTURI------------>",redirectUri);
                    return res.redirect(redirectUri, next);     
                }
            });
            connection.release();
        });
            
    } else {
        return res.send(400, 'Request did not contain redirect_uri and username in the query string');
    }
});
//-------------------//
// Configurar mensaje de bienvenida al BOT//
server.get('/welcomemsg', restify.plugins.queryParser(), function (req, res, next) {
    var data = {
        setting_type: "greeting",
        greeting:{
            text: "Hola {{user_full_name}}! Soy Dibot, tu asistente personal para ayudarte a realizar tus tareas tributarias mas importantes."
        }
    };

    // Start the request
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: process.env.FACEBOOK_PAGE_TOKEN },
        method: 'POST',
        json: data
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);

        } else {
            // TODO: Handle errors
            res.send(body);
        }
    });
});
// ------------------------------------ //

// Configurar mensaje de bienvenida al BOT//
server.get('/empezarbut', restify.plugins.queryParser(), function (req, res, next) {
    var data = {
        setting_type: "call_to_actions",
        thread_state: "new_thread",
        call_to_actions: [
            {
                payload: "empezar"
            }
        ]
    };


    // Start the request
    request({
        url: 'https://graph.facebook.com/v2.6/me/thread_settings',
        qs: { access_token: process.env.FACEBOOK_PAGE_TOKEN },
        method: 'POST',
        json: data
    },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // Print out the response body
            res.send(body);

        } else {
            // TODO: Handle errors
            res.send(body);
        }
    });
});
// ------------------------------------ //

//Rotear directorios//
server.get(/\/web\/?.*/, restify.plugins.serveStatic({
  directory: __dirname
}));
server.get(/\/process\/?.*/, restify.plugins.serveStatic({
  directory: __dirname
}));
server.get(/\/images\/?.*/, restify.plugins.serveStatic({
  directory: __dirname
}));
//-----------------//


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
            session.send('¡Ingreso exitoso!. ¿Qué más deseas hacer?:');
            var message = new builder.Message()
            .attachmentLayout(builder.AttachmentLayout.carousel)
            .attachments([
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Recibir notificaciones",
                        "subtitle": 'Frases: "Quiero subscribirme al servicio de notificaciones", "Subscribirme a la notificaciones", "Enviame notificaciones"',
                        "images": [
                          {
                            "url": "http://dibot.azurewebsites.net/images/notificacion.png"
                          }
                        ],
                        "buttons": [
                          {
                            "type": "postBack",
                            "title": "Recibir notificaciones",
                            "value":"notificaciones"
                          }
                        ]
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Formalizar mi RUT",
                        "subtitle": 'Frases: "Formalizar mi RUT", "Formalizar RUT".',
                        "images": [
                          {
                            "url": "http://dibot.azurewebsites.net/images/formalizar.jpg"
                          }
                        ],
                        "buttons": [
                          {
                            "type": "postBack",
                            "title": "Formalizar mi RUT",
                            "value":"formalizar mi rut"
                          }
                        ]
                    }
                },
                {
                    "contentType": "application/vnd.microsoft.card.hero",
                    "content": {
                        "title": "Agendar cita",
                        "subtitle": 'Frases: "Quiero agendar una cita", "Agendar una cita", "Quiero pedir una cita"',
                        "images": [
                          {
                            "url": "http://dibot.azurewebsites.net/images/agendar.jpg"
                          }
                        ],
                        "buttons": [
                          {
                            "type": "postBack",
                            "title": "Agendar cita",
                            "value":"Quiero agendar una cita"
                          }
                        ]
                    }
                }
            ]);
            session.endDialog(message);
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

bot.dialog('Hola', require('./actions/empezar')).triggerAction({
    matches: 'Hola'
});

bot.dialog('Ayuda', require('./actions/ayuda')).triggerAction({
    matches: 'Ayuda',
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

bot.dialog('Terminar', require('./actions/terminar')).triggerAction({
    matches: 'Terminar',
    onSelectAction: (session, args, next) => {
        // Add the help dialog to the dialog stack 
        // (override the default behavior of replacing the stack)
        session.beginDialog(args.action, args);
    }
});

//Acciones para cambiar de contexto en creacion de RUT//
bot.dialog('CrearRut', require('./actions/crearRut')).triggerAction({
    matches: 'CrearRut'
}).endConversationAction("endCrearRut", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

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

//Accion para formalizar el RUT//
bot.dialog('FormalizarRut', require('./actions/formalizarRut')).triggerAction({
    matches: 'FormalizarRut'
}).endConversationAction("endFormalizarRut", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('SubirCedula', require('./actions/rut/subirCedula')).triggerAction({
    matches: 'SubirCedula'
});
//----------------------------//

//Accion para actualizar el RUT//
bot.dialog('ActualizarRut', require('./actions/actualizarRut')).triggerAction({
    matches: 'ActualizarRut'
}).endConversationAction("endActualizarRut", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('AbrirActualizar', require('./actions/rut/abrirActualizar')).triggerAction({
    matches: 'AbrirActualizar'
});
//----------------------------//

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
}).endConversationAction("endCrearCita", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
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

//Reprogramar cita//
bot.dialog('ReprogramarCita', require('./actions/reprogramarCita')).triggerAction({
    matches: 'ReprogramarCita'
}).endConversationAction("endReprogramarCita", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('ReprogFecha', require('./actions/cita/reprogFecha')).triggerAction({
    matches: 'ReprogFecha'
});

bot.dialog('ReprogHora', require('./actions/cita/reprogHora')).triggerAction({
    matches: 'ReprogHora'
});

bot.dialog('ReprogLugar', require('./actions/cita/reprogLugar')).triggerAction({
    matches: 'ReprogLugar'
});
//---------------//

//Cancelar una cita//
bot.dialog('CancelarCita', require('./actions/cancelarCita')).triggerAction({
    matches: 'CancelarCita'
}).endConversationAction("endCancelarCita", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('SeleccionarCita', require('./actions/cita/seleccionarCita')).triggerAction({
    matches: 'ReprogLugar'
});
//----------------//

//Recibir notificaciones//
bot.dialog('Notificaciones', require('./actions/notificar')).triggerAction({
    matches: 'Notificaciones'
}).endConversationAction("endNotificaciones", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('HoraNotificacion', require('./actions/notificacion/horaNoti')).triggerAction({
    matches: 'Notificaciones'
});
//---------------------//

//Cancelar notificaciones//
bot.dialog('CancelarNoti', require('./actions/cancelarNoti')).triggerAction({
    matches: 'CancelarNoti'
}).endConversationAction("endCancelarNoti", "La operación anterior ha sido cancelada. ¿Como más puedo ayudarte?. Puedes escribir ayuda para mostrarte los comandos mas comunes.",{
    matches: /^cancelar$|^adios$/i,
    confirmPrompt: "Si eliges cancelar, los datos que has ingresado se perderan. ¿Deseas continuar?"
});

bot.dialog('ConfirmarCancel', require('./actions/notificacion/confirmarCancel')).triggerAction({
    matches: 'Notificaciones'
});
//----------------------//