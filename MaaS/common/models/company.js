// Name: {company.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

var app = require('../../server/server.js');

module.exports = function(Company) {
    
    // Elimino l'azienda e i relativi utenti
    Company.deleteCompany = function(id, email, cb) {
        Company.findById(id, function(err, company) {
            if(err || !company)
                return cb(err);
            var user = app.models.user;
            user.findOne({where: {companyId: company.id, email: email}, limit: 1}, function(err, userInstance) {
                if(err || !userInstance)
                    return cb(err);
                if(userInstance.role != "Owner" && company.owner == userInstance) {
                    var error = {
                        message: 'You haven\'t the rights to delete this company'
                    };
                    return cb(null, error);
                }
                company.users.destroyAll(function(err) {
                    if(err)
                        return cb(err);
                    Company.deleteById(company.id, function(err) {
                        if(err) console.log("> error deleting company:", company.name);
                        console.log("> company deleted:", company.name);
                        return cb(null, null, company.name);
                    });
                });
            });
        });
    };

    Company.remoteMethod(
        'deleteCompany',
        {
            description: 'Delete Company by passing id to delete and email of the user making the request.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Company id to delete'},
                { arg: 'email', type: 'string', required: true, description: 'User email making request'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'name', type: 'String'}
            ],
            http: { verb: 'delete', path: '/deleteCompany/:id' }
        }
    );

};
