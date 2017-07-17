var builder = require('botbuilder');
var util = require('util');
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
    host     : 'us-cdbr-azure-southcentral-f.cloudapp.net',
    user     : 'bdfb18a7b2c383',
    password : '669f8c04',
    database : 'dibot'
});

module.exports = [
    function (session) {
        connection.connect(function(err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
        });

        connection.query("SELECT f_cita, h_cita, lugar FROM cita WHERE id_usuario = ?",session.userData.idUsuario, function(err, result, fields) {
            if (err) throw err;
            console.log("ERROR EN ACCOUNT_LINKING---------->", result);
            console.log("RESULT ACOOUNT_LINKING----------->", result);
            if(result.length > 0){
                var f_cita = result[0].f_cita;
                var h_cita = result[0].h_cita;
                var lugar = result[0].lugar;
                builder.Prompts.text(session, "Por favor ingresa la hora en la que deseas la cita en formato: HH:MM");
            }else{
                builder.Prompts.text(session, "Por favor ingresa la hora en la que deseas la cita en formato: HH:MM");
            }
        });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
];