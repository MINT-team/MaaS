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
var config = require('../../server/config.json');
var app = require('../../server/server.js');
var path = require('path');
var host = 'maas-navid94.c9users.io';
var port = '8080';

module.exports = function(Externaldatabase) {
    Externaldatabase.connectDbs = function() {
        var Databases = app.models.Externaldatabase;
        Databases.findById()
    }
};
