// Name: {create-default-modelData.js}
// Module: {Back-end}
// Location: {/MaaS/server/boot/}

// History:
// Version         Date            Programmer
// ==========================================

var async = require('async');
module.exports = function(app) {
    var maas = app.dataSources.maas;
    async.parallel({
        superAdmins: async.apply(createSuperAdmins)
    }, function(err, results) {
            if (err)
                throw err;
            createSuperAdmins(results.superAdmins, function(err) {
            console.log('> models created successfully');
        });
    });

   function createSuperAdmins(cb) {
       
        var email_value='superadmin@gmail.com';
        var user = app.models.user;
        var SuperAdmin = app.models.SuperAdmin;
        SuperAdmin.findOne({where: {email: email_value}, limit: 1}, function(err,results){
            if (!results) 
            {
                user.findOne({where: {email: email_value}, limit: 1}, function(err,results) {
                    if (results) 
                    {
                        console.log('> Email already registered as User');
                    }
                    else 
                    {
                        SuperAdmin.create([
                            { email: email_value, password: '123456789' }
                        ], cb);
                        maas.autoupdate('SuperAdmin', function(err) {
                            if (err) { return cb(err); }
                        });
                    }
                });
            }
            else
            {
                console.log('> Email already registered as SuperAdmin')
            }
        });
    }
};