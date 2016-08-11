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
//var ExternalDatabaseStore = require('../../scripts/stores/ExternalDatabaseStore.react.jsx');
var app = require('../../server/server.js');
//var path = require('path');
//var host = 'maas-navid94.c9users.io';
//var port = '8080';
var Databases = app.models.ExternalDatabase;
// var user = loopback.getCurrentContext().get('currentUser');
// var company = user.companyId;
//var company = localStorage.getItem('companyName');
var connections = [];

module.exports = function(ExternalDatabase) {
    ExternalDatabase.connectDb = function(id, cb) {
        //var Databases = app.models.ExternalDatabase;
        // var user = loopback.getCurrentContext().get('currentUser');
        // var company = user.companyId;
        //var companyId = localStorage.getItem('companyId');
        //var connections = []; //da discuterne l'inserimento in user per mantenere le connessioni nell'utente
        // var Databases = request.get(user/ExternalDatabases/id/company);
        if(id)
        {
            app.models.Company.findById(id, function(err, companyInstance){
                console.log(companyInstance.id);
                Databases.find({where: {company: companyInstance.id}},  function(err) {
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
                            Databases[i].connection = conn;
                            Databases.updateAll({name: Databases[i].name}, {connection: conn}, function(err, info){
                                if(!err)
                                {
                                    ExternalDatabase.updateAll({name: Databases[i].name}, {connection: conn}, function(err, info){});
                                }
                            });
                            connections.push(conn);
                        }
                        //ExternalDatabaseStore.setDbs(Databases, function(err){}); //da cambiare
                        //ExternalDatabaseStore.setConnections(connections, function(err){}); //da cambiare
                        return cb(null);
                    }
                    else
                    {
                        if(length <= 0)
                        {
                            console.log('> no databases found for your company');
                            return cb(err);
                        }
                        else
                        {
                            if(err)
                            {
                                console.log('> failed connecting databases for your company');
                                return cb(err);
                            }
                        }
                    }
                });
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
        'connectDb',
        {
            description: 'Connects all the external databases.',
            accepts: [{ arg: 'id', type: 'string', required: true, description: 'Company Id'}],
            returns: [
                {arg: 'error', type: 'Object'}
            ],
            http: { verb: 'post', path: '/connectDbs' }
        }
    );
    
    ExternalDatabase.addExtDb = function(id, name, password, connString, cb) {
        var Database = app.models.ExternalDatabase;
        if(id && name != "" && password != "" && connString != ""){
            //var company = localStorage.getItem('companyName');
            var Company = app.models.Company;
            Company.findById(id, function(err, companyInstance){
                var conn = mongoose.createConnection(connString);
                conn = JSON.parse(conn);
                ExternalDatabase.create({name: name, password: password, connString: connString, companyId: companyInstance.id, connected: true}, function(err, externalDatabaseInstance){
                    if(err)
                    {
                        Database.destroyById(externalDatabaseInstance.id);
                        console.log('> failed creating database.');
                        return cb(err);
                    }
                    else
                    {
                        console.log(externalDatabaseInstance);
                        //var connString = externalDatabaseInstance.connString;
                        //var conn = mongoose.createConnection(connString);
                        //console.log(conn);
                       // externalDatabaseInstance.connection = conn;
                        //externalDatabaseInstance.save();
                        //console.log(externalDatabaseInstance.connection);
                        /*
                        Database.updateAll({name: externalDatabaseInstance.name}, {connection: conn}, function(err, info){
                            if(!err)
                            {
                                ExternalDatabase.updateAll({name: externalDatabaseInstance.name}, {connection: conn}, function(err, info){});
                            }
                            console.log(">stampa :");
                            console.log(externalDatabaseInstance.connection);
                            
                            var DB = app.models.ExternalDatabase;
                            DB.findOne({where: {name: 'db 2'}}, function(err, dbInstance){
                                var obj = dbInstance.connection;
                                var n = dbInstance.name;
                    
                            });
                            
                        });
                        */
                        connections.push(conn);
                    }
                });
                return cb(null);
            });
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
    
    ExternalDatabase.remoteMethod(
        'addExtDb',
        {
            description: 'Adds an external database to the company.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Company Id'},
                { arg: 'name', type: 'string', required: true, description: 'Database name'},
                { arg: 'password', type: 'string', required: true, description: 'Password'},
                { arg: 'connString', type: 'string', required: true, description: 'Connection string'}
            ],
            returns: [
                {arg: 'error', type: 'Object'}
            ],
            http: { verb: 'post', path: '/addExtDb' }
        }
    );
};