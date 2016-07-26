// Name: {external-database.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

// var mongoose = require('mongoose');
// mongoose.connect('mongodb://');

// module.exports = {
//     'url' : ''
// }


var loopback = require('loopback');
var mongoose = require('mongoose');
//var config = require('../../server/config.json');
var app = require('../../server/server.js');
//var path = require('path');
//var host = 'maas-navid94.c9users.io';
//var port = '8080';

module.exports = function(ExternalDatabase) {
    ExternalDatabase.connectDbs = function(cb) {
        var Databases = app.models.ExternalDatabase;
        // var user = loopback.getCurrentContext().get('currentUser');
        // var company = user.companyId;
        var company = sessionStorage.getItem('companyName');
        var connections = []; //da discuterne l'inserimento in user per mantenere le connessioni nell'utente
        // var Databases = request.get(user/ExternalDatabases/id/company);
        if(company)
        {
            Databases.find({where: {companyId: company}},  function(err) {
                var length = Databases.length;
                if(!err && length > 0)
                {
                    for(var i = 0; i < length; ++i){
                        //var dbName = name;
                        //var dbPassword = password;
                        // var host = 'ds029715.mlab.com'; //da definire in mLab
                        // var port = '29715'; //da definire in mLab
                        // var connString = 'mongodb://' + company + ':' + Databases[i].password + '%40' + host + ':' + port + '/' + Databases[i].name;
                        var connString = Databases[i].connString;
                        var conn = mongoose.createConnection(connString);
                        connections.push(conn);
                    }
                    return cb(null);
                }
                else
                {
                    if(length <= 0)
                    {
                        console.log('> no databases found for: ', sessionStorage.email);
                        return cb(err);
                    }
                    else
                    {
                        if(err)
                        {
                            console.log('> failed connecting databases for: ', sessionStorage.email);
                            return cb(err);
                        }
                    }
                }
            });
        }
        else
        {
            var err = {
                    message: 'Incorrect company value'
                };
            return cb(err);
        }
    };

    ExternalDatabase.remoteMethod(
        'connectDbs',
        {
            description: 'Connects all the external databases.',
            accepts: [],
            returns: [
                {arg: 'error', type: 'Object'}
            ],
            http: { verb: 'post', path: '/connectDbs' }
        }
    );
    
    ExternalDatabase.addExtDb = function(name, password, connString, cb) {
        var Database = app.models.ExternalDatabase;
        if(name != "" && password != "" && connString != ""){
            var company = sessionStorage.getItem('companyName');
            ExternalDatabase.create({name: name, password: password, connString: connString, companyName: company, allowed: true}, function(err, databaseInstance){
                if(err)
                {
                    Database.destroyById(databaseInstance.id);
                    console.log('> failed creating database.');
                    return cb(err);
                }
            });
            return cb(null);
        }
        else
        {
            console.log('> failed creating database, required fields are missing.');
            var err = {
                    message: 'Missing required values'
                };
            return cb(err);
        }
    };
};