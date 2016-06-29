module.exports = function(app, callback) {
    //var express = require('express');
    //var app = express();
    //var port = process.env.PORT || 8080;
    var path = require('path');
    app.get('/asd',function (req, res){
        //res.SendFile(path.resolve('$!../client','index.html'));
        res.sendFile(path.resolve('client/index.html'));
    });
    app.get('/asd/lol',function (req, res){
        //res.SendFile(path.resolve('$!../client','index.html'));
        res.sendFile(path.resolve('client/index.html'));
    });
    //app.listen(8080);
    callback();
};