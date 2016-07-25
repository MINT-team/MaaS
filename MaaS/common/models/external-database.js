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
        var user = loopback.getCurrentContext().get('currentUser');
        var company = user.companyId;
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
                        var host; //da definire in mLab
                        var port; //da definire in mLab
                        var connString = 'mongodb://' + Databases[i].name + ':' + Databases[i].password + '%40' + host + ':' + port + '/' + Databases[i].name;
                        var conn = mongoose.createConnection(connString);
                        connections.push(conn);
                    }
                    return cb(null);
                }
                else
                {
                    if(length <= 0)
                    {
                        console.log('> no databases found for: ', user.email);
                        return cb(err);
                    }
                    else
                    {
                        if(err)
                        {
                            console.log('> failed connecting databases for: ', user.email);
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
};