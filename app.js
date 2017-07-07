var builder = require('botbuilder');
var restify = require('restify');
var mysql = require('mysql');

var LuisActions = require('./core');
var SampleActions = require('./samples/all');
var LuisModelUrl = process.env.LUIS_MODEL_URL;

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var connection = mysql.createConnection(
    {
        host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
        user     : 'bdfb18a7b2c383',
        password : '669f8c04',
        database : 'dibot'
    }
);

server.get('/authorize', restify.queryParser(), function (req, res, next) {
    if (req.query && req.query.redirect_uri && req.query.username && req.query.password) {
        var username = req.query.username;
        var password = req.query.password;
        var idUsuario;

        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            connection.query('SELECT id_usuario FROM registro WHERE username = ? AND password = ?', [username,password], function(err, result, fields) {
                if (err) { 
                    console.log("Error en la consulta SQL------>",err);
                    return;
                }
                console.log(result);
            });
        });
        connection.end();

        // Here, it would be possible to take username (and perhaps password and other data)
        // and do some verifications with a backend system. The authorization_code query string
        // argument is an arbitrary pass-through value that could be stored as well
        // to enable verifying it once Facebook sends the `Account Linking webhook event`
        // that we handle below. In this case, we are passing the username via the authorization_code
        // since that avoids a need for an external databases in this simple scenario.

        if(idUsuario){
            var redirectUri = req.query.redirect_uri + '&authorization_code=' + idUsuario;
        }else{
            return res.send("No se ha podido linkear la cuenta");
        }
        
        return res.redirect(redirectUri, next);
    } else {
        return res.send(400, 'Request did not contain redirect_uri and username in the query string');
    }
});

server.get(/\/static\/?.*/, restify.serveStatic({
  directory: __dirname
}));


server.get('/modifyRut', function(req,res,next){
    fs.readFile('./docs/index.html', 'utf8', function(err, file) {
        if (err) {
            res.send(500);
            return next();
        }

        res.send({
            code: 200,
            noEnd: true
        });
        res.write(file);
        res.end();
        return next();
    });
});

var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intentDialog = bot.dialog('/', new builder.IntentDialog({ recognizers: [recognizer] })
    .onDefault(DefaultReplyHandler));

LuisActions.bindToBotDialog(bot, intentDialog, LuisModelUrl, SampleActions, {
    defaultReply: DefaultReplyHandler,
    fulfillReply: FulfillReplyHandler,
    onContextCreation: onContextCreationHandler
});

function DefaultReplyHandler(session) {
    session.endDialog(
        'Sorry, I did not understand "%s". Use sentences like "What is the time in Miami?", "Search for 5 stars hotels in Barcelona", "Tell me the weather in Buenos Aires", "Location of SFO airport")',
        session.message.text);
}

function FulfillReplyHandler(session, actionModel) {
    console.log('Action Binding "' + actionModel.intentName + '" completed:', actionModel);
    session.endDialog(actionModel.result);
}

function onContextCreationHandler(action, actionModel, next, session) {

    // Here you can implement a callback to hydrate the actionModel as per request

    // For example:
    // If your action is related with a 'Booking' intent, then you could do something like:
    // BookingSystem.Hydrate(action) - hydrate action context already stored within some repository
    // (ex. using a booking ref that you can get from the context somehow)

    // To simply showcase the idea, here we are setting the checkin/checkout dates for 1 night
    // when the user starts a contextual intent related with the 'FindHotelsAction'

    // So if you simply write 'Change location to Madrid' the main action will have required parameters already set up
    // and you can get the user information for any purpose

    // The session object is available to read from conversationData or
    // you could identify the user if the session.message.user.id is somehow mapped to a userId in your domain

    // NOTE: Remember to call next() to continue executing the action binding's logic

    if (action.intentName === 'FindHotels') {
        if (!actionModel.parameters.Checkin) {
            actionModel.parameters.Checkin = new Date();
        }

        if (!actionModel.parameters.Checkout) {
            actionModel.parameters.Checkout = new Date();
            actionModel.parameters.Checkout.setDate(actionModel.parameters.Checkout.getDate() + 1);
        }
    }

    next();
}