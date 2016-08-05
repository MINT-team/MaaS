var app = require('../../server/server.js');

module.exports = function(DSL) {
    DSL.saveDefinition = function(userId ,type, name, source, cb) {
        if(!type || !name)
        {
            var error = {
                message: "Missing data for DSL creation"
            };
            return cb(null, error, null);
        }
        DSL.create({type: type, name: name, source: source, createdBy: userId}, function(err, DSLInstance) {
            if(err || !DSLInstance)
            {
               console.log('> Failed creating DSL.');
               return cb(err);
            }
            // Define relation between user and DSL
            var user = app.models.user;
            user.findById(userId, function(err, userInstance) {
                if(err)
                {
                    console.log("> Failed creating DSL, no user found to relate.");
                    DSL.destroyById(DSLInstance.id, function(err) {
                        if(err) 
                            return cb(err, null, null);
                    });
                    return cb(err, null, null);
                }
                var Company = app.models.Company;
                Company.findById(userInstance.companyId, function(err, company) {
                    if(err || !company)
                        return cb(err, null, null);
                    // Add DSL to the Admins of the company
                    company.users({where: {role: "Administrator"}}, function(err, admins) {
                        if(err || !admins)
                            return cb(err, null, null);
                        admins.forEach(function(admin, i) 
                        {
                            console.log("admin:", admin.email);
                            DSLInstance.users.add(admin,function(err) {
                                if(err)
                                {
                                    console.log("> Error creating relationship for the DSL");
                                    return cb(err, null, null);
                                }
                            });
                        });
                    });
                    // Add DSL to the Owner of the company
                    company.owner(function(err, owner) {
                        console.log("\nOwner:", owner);
                        DSLInstance.users.add(owner, function(err) {
                            if(err)
                            {
                                console.log("> Error creating relationship for the DSL");
                                return cb(err, null, null);
                            }
                        });
                    });
                    // If user creating the DSL is not Owner or Admin add DSL to him
                    if(userInstance.role == "Member")
                    {
                        DSLInstance.users.add(userInstance, function(err) {
                            if(err)
                            {
                                console.log("> Error creating relationship for the DSL");
                                return cb(err, null, null);
                            }
                        });
                    }
                    
                    // log utenti
                    DSLInstance.users({ where: {}}, function(err, users){
                        console.log("\nUtenti: ", users);
                    });
                });
            });
            
            console.log("> Created DSL:", DSLInstance.id);
            return cb(null, null, DSLInstance);
       });
    };
    
    DSL.remoteMethod(
        'saveDefinition',
        {
            description: "Change user's editor configuration options",
            accepts: [
                { arg: 'userId', type: 'string', required: true, description: 'User id' },
                { arg: 'type', type: 'string', required: true, description: 'Definition type' },
                { arg: 'name', type: 'string', required: true, description: 'Definition name' },
                { arg: 'source', type: 'string', required: true, description: 'Definition source' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'definition', type: 'Object'}
            ],
            http: { verb: 'post', path: '/saveDefinition' }
        }
    );
    
    DSL.overwriteDefinition = function(id, type, source, cb) {
       DSL.findById(id, function(err, DSL) {
           if(err) return cb(err, null, null);
           DSL.updateAttributes({type: type, source: source}, function(err, newDSL) {
               if(err) return cb(err, null, null);
               console.log("> Updated DSL:", newDSL.id);
               return cb(null, null, newDSL);
           });
       });
    };
    
    DSL.remoteMethod(
        'overwriteDefinition',
        {
            description: "Change user's editor configuration options",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' },
                { arg: 'type', type: 'string', required: true, description: 'Definition type' },
                { arg: 'source', type: 'Object', required: true, description: 'Definition source' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'definition', type: 'Object'}
            ],
            http: { verb: 'put', path: '/:id/overwriteDefinition' }
        }
    );
    
    
};
