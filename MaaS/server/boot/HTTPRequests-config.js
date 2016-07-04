module.exports = function(app, callback) {
    var path = require('path');

    app.get('/login',function (req, res){
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
    app.get('/profile/changeAvatar',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });
    app.get('/profile/personalData',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });
    app.get('/profile/changePassword',function (req, res){
        res.sendFile(path.resolve('client/index.html'));
    });

    callback();
};