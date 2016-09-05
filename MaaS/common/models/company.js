// Name: {company.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

var app = require('../../server/server.js');

module.exports = function(Company) {
    
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
                
                // Remove all company DSLs
                userInstance.dsl.destroyAll( function(err) {
                    if (err)
                    {
                        console.log("> error deleting dsl: ",err);
                        return cb(err);
                    }
                });
           
               //Remove databases of the company
                company.externalDatabases.destroyAll(function(err) {
                    if (err)
                    {
                        console.log("> error deleting databases: ",err);
                        return cb(err);
                    }
                    console.log("> databases deleted");
                });
          
                //Remove Users of the company
                company.users.destroyAll(function(err) {
                    if(err)
                        return cb(err);
                    Company.deleteById(company.id, function(err) {
                        if(err) console.log("> error deleting company:", company.name);
                        console.log("> company deleted:", company.id);
                        return cb(null, null, company.id);
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
                {arg: 'id', type: 'String'}
            ],
            isStatic: true,
            http: { verb: 'delete', path: '/deleteCompany/:id' }
        }
    );
    
    //change name of a company wich as companyId= id
    Company.changeCompanyName = function(id, name, cb){
        Company.findById(id, function(err, company) {
            if(err)
                return cb(err);
           Company.findOne({where: {name: name}, limit: 1}, function(err, companyInstance) {
                if(!companyInstance){
                    var oldName = company.name;
                    company.updateAttribute('name', name, function(err, company) {
                        if(err) {
                          console.log('> Failed changing name');
                          return cb(err);
                        }
                          console.log('> Name changed successfully');
                          var data = {
                              newName: company.name,
                              oldName: oldName
                          };
                          return cb(null, null, data);   
                    });
                }else{
                    var error = { message: 'A company with this name already exists' };
                    return cb(null, error);   
                }
            });
        });
    };
    
    Company.remoteMethod(
        'changeCompanyName',
        {
            description: "Change the name of a company",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Company id' },
                { arg: 'name', type: 'string', required: true, description: 'New name' },
                
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object'},
            ],
            http: { verb: 'put', path: '/:id/changeCompanyName' }
        }
    );
    
    Company.getDSLDefinitionsCount = function(companyId, cb) {
        Company.findById(companyId, function(err, company) {
            if (err)
            {
                console.log('Failed retrieving company by id', err);
                return cb(err);
            }
            
            company.owner(function(err, owner) {
                if (err)
                {
                    console.log('Failed retrieving owner of the company', err);
                    return cb(err);
                }
                owner.dsl(function(err, DSLDefinitions) {
                    if (err)
                    {
                        console.log('Failed retrieving DSL definitions of the company', err);
                        return cb(err);
                    }
                    return cb(null, DSLDefinitions.length);
                });
            });
        });
    };
    
    Company.remoteMethod(
        'getDSLDefinitionsCount',
        {
            description: "Get the number of DSL definitions of a company",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Company id' },
            ],
            returns: [
                { arg: 'count', type: 'Number'}
            ],
            http: { verb: 'get', path: '/:id/getDSLDefinitionsCount' }
        }
    );

};
