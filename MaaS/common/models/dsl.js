var app = require('../../server/server.js');
var sweet = require('sweet.js');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DocumentSchema = new Schema({}, {strict: false});
var CompileErrors = require('./compileErrors.js');
var AttributesReader = require('./attributesReader.js');

module.exports = function(DSL) {
    // Create a DSL definition
    DSL.saveDefinition = function(userId, type, name, source, externalDatabaseId, cb) {
        
        // Clear and returns the error
        function relationError(DSLInstance, err) {
            DSL.destroyById(DSLInstance.id, function(err) {
                if(err) 
                    return cb(err, null, null);
            });
            console.log("> Error creating relationship for the DSL");
            return cb(err, null, null);
        }
        
        if(!type || !name)
        {
            var error = {
                message: "Missing data for DSL creation"
            };
            return cb(null, error, null);
        }
        DSL.create({type: type, name: name, source: source, createdBy: userId, externalDatabaseId: externalDatabaseId}, function(err, DSLInstance) {
            if(err || !DSLInstance)
            {
               console.log('> Failed creating DSL.');
               return cb(err);
            }
            // Define relation between user and DSL
            var DSLAccess = app.models.DSLAccess;
            var user = app.models.user;
            user.findById(userId, function(err, userInstance) {
                if(err)
                {
                    relationError(DSLInstance, err);
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
                            DSLAccess.create({userId: admin.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                                if(err)
                                    return relationError(DSLInstance, err);
                            });
                        });
                    });
                    // Add DSL to the Owner of the company
                    company.owner(function(err, owner) {
                        if(err)
                        {
                            return relationError(DSLInstance, err);
                        }
                        DSLAccess.create({userId: owner.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                            if(err)
                                return relationError(DSLInstance, err);
                        });
                    });
                    // If user creating the DSL is not Owner or Admin add DSL to him
                    if(userInstance.role == "Member")
                    {
                        DSLAccess.create({userId: userInstance.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                            if(err)
                                return relationError(DSLInstance, err);
                        });
                    }
                    console.log("> Created DSL:", DSLInstance.id);
                    return cb(null, null, DSLInstance);
                });
            });
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
                { arg: 'source', type: 'string', required: true, description: 'Definition source' },
                { arg: 'externalDatabaseId', type: 'string', required: true, description: 'External DatabaseId id' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'definition', type: 'Object'}
            ],
            http: { verb: 'post', path: '/saveDefinition' }
        }
    );
    
    DSL.overwriteDefinition = function(id, type, source, name, cb) {
        DSL.findById(id, function(err, DSLInstance) {
            if(err)
            {
                return cb(err, null, null);
            }
            DSLInstance.updateAttributes({type: type, source: source, name: name}, function(err, newDSL) {
                if(err)
                {
                    return cb(err, null, null);
                }
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
                { arg: 'source', type: 'string', required: true, description: 'Definition source' },
                { arg: 'name', type: 'string', required: true, description: 'Definition name' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'definition', type: 'Object'}
            ],
            http: { verb: 'put', path: '/:id/overwriteDefinition' }
        }
    );
    
    DSL.deleteDefinition = function(id, cb) {
        DSL.findById(id, function(err, DSLInstance) {
            if (err)
            {
                return cb(err, null);
            }
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
    };
    
    DSL.remoteMethod(
        'deleteDefinition',
        {
            description: "Delete one DSL definition and its relationships",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' }
            ],
            returns: [
                { arg: 'error', type: 'Object' }
            ],
            http: { verb: 'delete', path: '/:id/deleteDefinition' }
        }
        
    );
    
    DSL.changeDefinitionPermissions = function(id, userId, permission, cb) {
        var DSLAccess = app.models.DSLAccess;
        var user = app.models.user;
        DSLAccess.findOne({where: {userId: userId, dslId: id}, limit: 1}, function(err, accessInstance) {
            if(err)
            {
                return cb(err);
            }
            user.findById(userId, function(err, userInstance) {
               if(err)
               {
                   return cb(err);
               }
               // User has access to dsl
                if(accessInstance) 
                {
                    if(permission == "none")
                    {
                        userInstance.permission = accessInstance.permission;
                        DSLAccess.destroyById(accessInstance.id, function(err) {
                            if(err)
                            {
                                return cb(err);
                            }
                            console.log("> Permission removed for DSL:", id);
                            return cb(null, null, 'delete', userInstance);
                        });
                    }
                    else
                    {
                        accessInstance.permission = permission;
                        userInstance.permission = accessInstance.permission;
                        accessInstance.save();
                        console.log("> Permission changed for DSL:", id);
                        return cb(null, null, 'update', userInstance);
                    }
                }
                else // User don't have access to dsl
                {
                    DSLAccess.create({userId: userId, dslId: id, permission: permission}, function(err, newAccessInstance) {
                        if(err)
                        {
                            return cb(err);
                        }
                        userInstance.permission = newAccessInstance.permission;
                        console.log("> Permission changed for DSL:", id);
                        return cb(null, null,'create', userInstance);
                    });
                }
            });
            
        });
    };
    
    DSL.remoteMethod(
        'changeDefinitionPermissions',
        {
            description: "Change the permissions for one specific DSL definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' },
                { arg: 'userId', type: 'string', required: true, description: 'User id' },
                { arg: 'permission', type: 'string', required: true, description: 'Definition permission' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'operation', type: 'string' },
                { arg: 'userPermission', type: 'Object' }
                
            ],
            http: { verb: 'put', path: '/:id/changeDefinitionPermissions' }
        }
        
    );
    
    DSL.compileDefinition = function(id, cb) {
        var ExternalDatabase = app.models.ExternalDatabase;
        DSL.findById(id, function(err, DSLInstance) {
            if(err)
            {
                console.log(err);
                return cb(err);
            }
            
            ExternalDatabase.findById(DSLInstance.externalDatabase, function(err, database) {
                if(err)
                {
                   console.log("> Error finding database of dsl");
                   return cb(err);
                }
               
                var conn = mongoose.connect(database.connString, function(err) {
                    if (err)
                    {
                        var error = {
                            message: "Failed connecting database"
                        };
                        console.log('> Failed connecting database.');
                        return cb(null, error, null);
                    }
                });
               
                DSL.compile(DSLInstance.source, function(err, expanded) {
                    if(err)
                    {
                        console.log("> DSL compilation error:", err);
                        conn.disconnect();
                        return cb(null, err);
                    }
                    var callback = function(err, identity, body) {
                        if(err)
                        {
                            console.log("errore remote method");
                            conn.disconnect();
                            return cb(null, err);
                        }
                        console.log('Non deve andare');
                        conn.disconnect();
                        return cb(null, null);
                    };
                    eval(expanded);     //  DSL.compileCell({...}, callback)
                });
            });
        });
    };
    
    DSL.remoteMethod(
        'compileDefinition',
        {
            description: "Change the permissions for one specific DSL definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' }
            ],
            returns: [
                { arg: 'error', type: 'Object' }
            ],
            http: { verb: 'post', path: '/:id/compileDefinition' }
        }
    );
    
    /*
    
    Compilo -> compileDefinition -> compile -> macro -> compileXXX -> err / null
    
    Eseguo -> executeDefinition -> compile -> macro -> compileXXX -> err / null
                                -> executeXXX -> err / result
                                                    
    */
    
    DSL.executeDefinition = function(id, cb) {
        var ExternalDatabase = app.models.ExternalDatabase;
        DSL.findById(id, function(err, DSLInstance) {
            if(err)
            {
                console.log(err);
                return cb(err);
            }
            
            ExternalDatabase.findById(DSLInstance.externalDatabase, function(err, database) {
                if(err)
                {
                   console.log("> Error finding database of dsl");
                   return cb(err);
                }
               
                var conn = mongoose.connect(database.connString, function(err) {
                    if (err)
                    {
                        var error = {
                            message: "Failed connecting database"
                        };
                        console.log('> Failed connecting database.');
                        return cb(null, error, null);
                    }
                });
                
                DSL.compile(DSLInstance.source, function(err, expanded) {
                    if(err)
                    {
                        console.log("> DSL compilation error:", err);
                        conn.disconnect();
                        return cb(null, err, null);
                    }
                    
                    var callback = function(err, identity, body) {
                        if(err)
                        {
                            conn.disconnect();
                            return cb(null, err);
                        }
                        conn.disconnect();
                        switch(DSLInstance.type)
                        {
                            case "Cell":
                                DSL.executeCell(identity, body, conn, function(){
                                    
                                });
                                break;
                        }
                    };
                    eval(expanded); // DSL.compileCell({...})
                });
            });
        });
    };
    
    DSL.remoteMethod(
        'executeDefinition',
        {
            description: "Change the permissions for one specific DSL definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
            ],
            http: { verb: 'post', path: '/:id/executeDefinition' }
        }
    );
    
    DSL.compile = function(dsl, cb) {
        var intepreterFile = __dirname + "/macro.sjs";
        var expanded;
        fs.readFile(intepreterFile, function(err, macro) {
            if(err)
            {
                console.log("> Errore:", err);
                return cb(err, null);
            }
            else
            {
                macro = macro.toString();
                try
                {
                    expanded = sweet.compile(macro + dsl);
                }
                catch(err)
                {
                    return cb(err.description, null);
                }
                return cb(null, expanded.code);
            }
        });
    };
    
    
    DSL.remoteMethod(
        'compile',
        {
            description: "Compile one DSL definition",
            accepts: [
                { arg: 'source', type: 'string', required: true, description: 'Definition source' }
            ],
            returns: [
                { arg: 'err', type: 'string' },
                { arg: 'expanded', type: 'string' }
                
            ],
            isStatic: true
        }
    );
    
    DSL.compileCell = function(identity, body, cb) {
        AttributesReader.readOptionalAttributes(identity, ['sortby', 'order', 'label', 'query', 'transformation', 'columnLabel'], function(identityOptionalAttributes) {
                    
                
            AttributesReader.readRequiredAttributes(identity, ['name', 'table', 'type'], function(identityMissing, identityRequiredAttributes) {
                if(identityMissing)
                {
                    if(Object.getOwnPropertyNames(body).length !== 0)
                    {
                        AttributesReader.readRequiredAttributes(body, ['value'], function(bodyMissing, bodyRequiredAttributes) {
                            if(bodyMissing)
                            {
                                var missing = [];
                                identityMissing.forEach(function(attr, i) {
                                    missing.push(attr);
                                });
                                bodyMissing.forEach(function(attr, i) {
                                    missing.push(attr);
                                });
                                CompileErrors.missingRequiredAttributes(missing, function(error) {
                                    console.log("> DSL compilation error:", error.message);
                                        
                                    return cb(error, null, null); // return errors of both identity and body
                                });
                            }
                        });
                    }
                    else
                    {
                        CompileErrors.missingRequiredAttributes(identityMissing, function(identityError) {
                            console.log("> DSL compilation error:", identityError.message);
                            return cb(identityError, null, null); // return only errors of identity
                        });
                    }
                }
                
                console.log("identityAttributes: ", identityRequiredAttributes);
                
                if(Object.getOwnPropertyNames(body).length !== 0)
                {
                    AttributesReader.readRequiredAttributes(body, ['value'], function(bodyMissing, bodyRequiredAttributes) {
                        if(bodyMissing)
                        {
                            CompileErrors.missingRequiredAttributes(bodyMissing, function(bodyError) {
                                console.log("> DSL compilation error:", bodyError.message);
                                return cb(bodyError, null, null); // return only body errors
                            });
                        }
                        /*
                        AttributesReader.readOptionalAttributes(identity, ['sortby', 'order', 'label', 'query', 'transformation', 'columnLabel'], function(identityOptionalAttributes) {
                        
                        });
                        */
                        console.log("identityAttributes: ", bodyAttributes);
                        return cb(null, null, identityAttributes, bodyRequiredAttributes); // return both identity and body attributes
                    });
                }
                else
                {
                    
                    return cb(null, null, identityAttributes, null); // return only identity attributes
                }
            });
        });
    };
    
    DSL.remoteMethod(
        'compileCell',
        {
            description: "Compile a Cell macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Cell identity' },
                { arg: 'body', type: 'object', required: true, description: 'Cell body' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'identity', type: 'Object' },
                { arg: 'body', type: 'Object' }
            ]
        }
        
    );
    
    
    /*
    Cell (table: 'users', name: 'level', query: {'email': 'admin@example.com'})
    
    */
    
    DSL.executeCell = function(identity, body, conn, cb) {
        var errors = DSL.compileCell(identity, body);
        if (!errors)
        {
            var collection = conn.model(identity.table, DocumentSchema);
            var query = collection.findOne(identity.query, identity.name, function(err, result) {
                if (err)
                {
                    console.log(err);
                    return cb(err);
                }
                console.log("> Cell result: ", result);
                return cb(null, result);
            });
        }
    };
    
    DSL.remoteMethod(
        'executeCell',
        {
            description: "Execute a Cell macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Cell identity' },
                { arg: 'body', type: 'object', required: true, description: 'Cell body' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
            ]
        }
    
    );
};