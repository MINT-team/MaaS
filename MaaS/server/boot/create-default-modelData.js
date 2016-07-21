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
       var email_value='ciacscso@gmail.com';
       var user = app.models.user;
       user.findOne({where: {email: email_value}, limit: 1}, function(err,results) {
           if (results)
           {
                console.log('> Email già registrata come utente');
           }
           else
           {
               var SuperAdmin = app.models.SuperAdmin;
               SuperAdmin.create([
                   { email: email_value, password: '123456789' }
                   ], cb);
                   maas.isActual('SuperAdmin', function(err, actual) {
                       if (!actual) {
                           maas.autoupdate('SuperAdmin', function(err) {
                               if (err) { return cb(err); }
                        });
                    }
                });
            }
        });
    }
};