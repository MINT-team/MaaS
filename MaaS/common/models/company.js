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
        console.log("> delete company");
        Company.findById(id, function(err, company) {
            console.log(">if findID");
            if(err || !company)
                return cb(err);
            var user = app.models.user;
            user.findOne({where: {companyId: company.id, email: email}, limit: 1}, function(err, userInstance) {
                if(err || !userInstance)
                    return cb(err);
                if(userInstance.role != "Owner" && company.owner == userInstance) {
                    console.log(">non sono un superAdmin");
                    var error = {
                        message: 'You haven\'t the rights to delete this company'
                    };
                    return cb(null, error);
                } 
                console.log(">sono un superAdmin");
                // Remove DSL of the company
                var DSL = app.models.DSL;
                userInstance.dsl({ where: {} }, function(err, DSLList) {
                    if(err || !DSLList)
                    {
                        return cb(err);
                    }
                    // Remove DSL accesses
                    DSLList.forEach(function(DSLInstance, i) {
                        console.log(">cancellazione DSL definition");
                        DSLInstance.users({ where: {} }, function(err, users) {
                            if(err)
                            {
                                return cb(err, null);
                            }
                            users.forEach(function(user, i) {
                                DSLInstance.users.remove(user, function(err) {
                                    if(err) 
                                    {
                                        console.log("> Error deleting DSL definition");
                                        return cb(err, null);
                                    }
                                });
                            });
                            // Success
                            DSL.destroyById(DSLInstance.id, function(err) {
                                if(err) 
                                {
                                    return cb(err, null);
                                }
                                console.log("> DSL definition deleted:", id);
                                return cb(null, null);
                            });
                        });
                    });
                });
                // Remove Users of the company
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
    
    Company.changeCompanyName = function(id, name, cb){
        Company.findById(id, function(err, company) {
            if(err)
                return cb(err);
           Company.findOne({where: {name: name}, limit: 1}, function(err, companyInstance) {
                if(!companyInstance){
                    company.updateAttribute('name', name, function(err, company) {
                        if(err) {
                          console.log('> Failed changing name');
                          return cb(err);
                        }
                          console.log('> Name changed successfully');
                          return cb(null, null, company.name);   // callback di successo
                    });
                }else{
                    console.log('> Company already exists:', company);
                    var error = { message: 'A company with this name already exists' };
                    return cb(error,null,null );   // callback di insuccesso
                }
            });
        });
    }

};
