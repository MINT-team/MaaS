// Name: {super-admin.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================


var loopback = require('loopback');
var config = require('../../server/config.json');
var app = require('../../server/server.js');
var path = require('path');
var host = 'maas-navid94.c9users.io';
var port = '8080';


module.exports = function(Superadmin) {
    
  //remote method for select the type of login (commonUser or SuperAdmin) 
    Superadmin.selectLogin = function(email, password, cb){
        var superAdmin = app.models.SuperAdmin;
        superAdmin.findOne({where: {email: email}, limit: 1}, function(err, results) {
                if(err) //return cb(lb, error, res);
                    return cb(err, null, null);
                if(results)  //superAdmin login
                    return cb(null, null, "superAdmin");
                else  //user login
                    return cb(null, null, "commonUser");
            });
    };

    Superadmin.remoteMethod(
        'selectLogin',
        {
            description: 'Check wich type of user want to login.',
            accepts: [
                { arg: 'email', type: 'string', required: true, description: 'User email'},
                { arg: 'password', type: 'string', required: true, description: 'Password'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'type', type: 'string'}
            ],
            http: { verb: 'post', path: '/selectlogin' }
        }
    );
    
   //remote hook for add the information about the type of user that has just logged 
    Superadmin.afterRemote('login', function(ctx, remoteMethodOutput, next) {
        var ctx_ttl = ctx.result.ttl ;
        var ctx_userId = ctx.result.userId ;
        var ctx_created = ctx.result.created ;
        var ctx_id = ctx.result.id ;
        var ctx_type = "superAdmin";
        
        ctx.result = {
                ttl: ctx_ttl,
                userId: ctx_userId,
                created :ctx_created,
                id: ctx_id,
                type: ctx_type
            };
        next();
    });

};
