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
        maas.isActual('SuperAdmin', function(err, actual) {
            if (!actual) {
                maas.autoupdate('SuperAdmin', function(err) {
                if (err)
                return cb(err);
                var SuperAdmin = app.models.SuperAdmin;
                SuperAdmin.create([
                    { email: 'superadmin@gmail.com', password: '123456789' }
                    ], cb);
                });
            }
        });
    }
};