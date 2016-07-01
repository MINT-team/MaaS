module.exports = function(app, callback) {
    //var express = require('express');
    //var app = express();
    //var port = process.env.PORT || 8080;
    var path = require('path');

    app.get('/login',function (req, res){
        //res.SendFile(path.resolve('$!../client','index.html'));
        res.sendFile(path.resolve('client/index.html'));
    });

    //configurazione pagina register
    app.get('/register',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });

    //configurazione pagina home
     app.get('/home',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });

    //configurazione pagina recoverpwd
     app.get('/recoverpwd',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });

    //configurazione pagina proflie
     app.get('/profile',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });

    //app.listen(8080);
    callback();
};