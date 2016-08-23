var app = require('../../server/server.js');
var sweet = require('sweet.js');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DocumentSchema = new Schema({}, {strict: false});
var AttributesReader = require('./attributesReader.js');
var intepreterFile = __dirname + "/macro.sjs";
var macro;

fs.readFile(intepreterFile, function(err, result) {
    if(err)
    {
        console.log("> Error: can't read macro definitions file. ", err);
        throw new Error("Error: can't read macro definitions file. " + err);
    }
    else
    {
        macro = result;
        console.log("> DSL configuration file read correctly");
    }
});


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
    
    /*
    DSL.compileCollection({name: "customers", label: "JuniorCustomers", id: "Junior", Weight: "0", perpage: "20", sortby: "surname", order: "asc", query: {age: {$lt: 40}}}, 
    [], DSL.compileDocument({table: "prova"}, [{name: "asd"}], {SendEmail: "true"}, callback), {Export: "true", SendEmail: "true"}, callback);
    
    */
    
    DSL.compile = function(dsl, cb) {
        var expanded;
        macro = macro.toString();
        var macroLines = macro.split("\n").length;
        try
        {
            expanded = sweet.compile(macro + dsl);
        }
        catch(err)
        {
            console.log("Sweetjs error:", err);
            var message;
            if(!err.description)
            {
                //Default message
                message = "DSL compilation error";
                var error = err.toString();
                if(error.match(/Action/g))
                {
                    message = "Action must define at least \"Export\" or \"SendEmail\"";
                }
                if(error.match(/Multiple actions/g))
                {
                    message = "Multiple actions defined, action must be unique";
                }
                if(error.match(/replacement values for syntax template must not be null or undefined/g))
                {
                    message = "Syntax error: unknown keyword or missing comma";
                }
                if(error.match(/Unexpected syntax/g))
                {
                    if(error.match(/List \[ {/g))
                        message = "Unexpected syntax: \"{\". Wrong use of parenthesis";
                    else if(error.match(/List \[ \[/g))
                        message = "Unexpected syntax: \"[\". Wrong use of parenthesis";
                    else if(error.match(/List \[ \(/g))
                        message = "Unexpected syntax: \"(\". Wrong use of parenthesis";
                    else
                    {
                        var start = "List [ ";
                        var end = " ] at:";
                        var startIndex = error.indexOf(start, 0) + start.length;
                        var endIndex = error.indexOf(end, 0);
                        var unexpected = error.substring(startIndex, endIndex);
                        startIndex = error.indexOf(start, endIndex) + start.length;
                        endIndex = error.length - 2;
                        var line = error.substring(startIndex, endIndex);
                        line = (parseInt(line) - macroLines) + 1;
                        
                        message = "Unexpected syntax";
                        if(unexpected)
                            message += ": \"" + unexpected + "\"";
                        if(!isNaN(line))
                            message += " at line " + line;
                    }
                }
                if(error.match(/expecting a : punctuator/g))
                {
                    message = "Syntax error: missing \":\"";
                }
            }
            else
            {
                message = err.description;
            }
            
            return cb(message, null);
            // errore virgole: [Error: replacement values for syntax template must not be null or undefined] 
        }
        return cb(null, expanded.code);
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
                database.company(function(err, company) {
                    if (err)
                    {
                        console.log("> Error finding company of database");
                        return cb(err);
                    }
                    company.users.count(function(err, usersCount) {
                        if (err)
                        {
                            console.log("> Error finding number of users in a company");
                            return cb(err);
                        }
                        var conn = mongoose.createConnection(database.connString, {server: {poolSize: usersCount}}, function(err) {
                            if (err)
                            {
                                var error = {
                                    message: "Failed connecting database"
                                };
                                console.log('> Failed connecting database:', err);
                                return cb(null, error, null);
                            }
                        });
                        DSL.compile(DSLInstance.source, function(err, expanded) {
                            if(err)
                            {
                                console.log("> DSL compilation error:", err);
                                conn.close();
                                return cb(null, err);
                            }
                            var callback = function(err, identity, body) {
                                if(err)
                                {
                                    console.log("> DSL compilation error:", err);
                                    conn.close();
                                    return cb(null, err);
                                }
                                conn.close();
                                console.log('> DSL compilation processed successfully');
                                return cb(null, null);
                            };
                            try
                            {
                                eval(expanded); // DSL.compileCell({...})
                            }
                            catch(err)
                            {
                                conn.close();
                                console.log("> DSL compilation error:", err);
                                var error = err.toString();
                                if(error.match(/ReferenceError/g) && error.match(/is not defined/g))
                                    return cb(null, "Syntax error: missing comma before transformation");
                                else
                                    return cb(null, error);
                            }
                        });
                    });
                });
            });
        });
    };
    
    DSL.remoteMethod(
        'compileDefinition',
        {
            description: "Compile a DSL definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' }
            ],
            returns: [
                { arg: 'error', type: 'Object' }
            ],
            http: { verb: 'post', path: '/:id/compileDefinition' }
        }
    );
    
    DSL.executeNestedDocument = function(id, result, identity, body, cb) {
        var data = {};
        data.types = [];
        data.result = [{}];
        if(identity.populate)
        {
            //.....
        }
            
            
        // DSL.executeDocument(identity, body, conn, function(error, data) {
        //     conn.close();
        //     if (error)
        //     {
        //         console.log("> DSL execution error:", error);
        //         return cb(null, error, null);
        //     }
        //     else
        //     {
        //         console.log("> DSL execution processed successfully");
        //         if(!data.label)
        //             data.label = "Document " + label;
        //         data.definitionType = "Document";
        //         return cb(null, null, data);
        //     }
        // });
        
        
        if(body && body.rows && body.rows.length > 0)   // document with rows
        {
            data.result = [ {} ];   // initialize the object to be filled with results matching rows values
            var returned = false;
            for(var i=0; !returned && i < body.rows.length; i++)
            {
                var row = body.rows[i];
                var rowValue = result[row.name];
                
                data.types.push(row.type);
                
                if(row.transformation)
                {
                    var transformedValue;
                    try
                    {
                        transformedValue = row.transformation(rowValue);
                    }
                    catch(err)
                    {
                        returned = true;
                        return cb(null, err, null);
                    }
                    AttributesReader.checkKeywordValue({ type: row.type, value: transformedValue }, function(keywordValueError) {
                        if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                        {
                            returned = true;
                            return cb(null, keywordValueError, null);
                        }
                        else
                        {
                            if(row.label)
                            {
                                data.result[0][row.label] = transformedValue;
                            }
                            else
                            {
                                data.result[0][row.name] = transformedValue;
                            }
                            
                            if(i == body.rows.length-1)  // if all rows are checked then returns
                            {
                                //console.log(data)
                                returned = true;
                                return cb(null, null, data);
                            }
                        }
                    });
                }
                else
                {
                    AttributesReader.checkKeywordValue({ type: row.type, value: rowValue }, function(keywordValueError) {
                        if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                        {
                            returned = true;
                            return cb(keywordValueError, null);
                        }
                        else
                        {
                            if(row.label)
                            {
                                data.result[0][row.label] = rowValue;
                            }
                            else
                            {
                                data.result[0][row.name] = rowValue;
                            }
                            
                            if(i == body.rows.length-1)  // if all rows are checked then returns
                            {
                                returned = true;
                                return cb(null, null, data);
                            }
                        }
                    });
                }
            }
        }
        else
        {
            data.result[0] = result;
            return cb(null, null, data);
        }
    };
     
    DSL.remoteMethod(
        'executeNestedDocument',
        {
            description: "Execute a nested Document definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Collection id' },
                { arg: 'result', type: 'Object', required: true, description: 'Raw object' },
                { arg: 'identity', type: 'Object', required: true, description: 'Document identity' },
                { arg: 'body', type: 'Object', required: true, description: 'Document body' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
            ],
            http: { verb: 'post', path: '/:id/executeNestedDocument' }
        }
    );
    
    
    
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
                database.company(function(err, company) {
                    if (err)
                    {
                        console.log("> Error finding company of database");
                        return cb(err);
                    }
                    company.users.count(function(err, usersCount) {
                        if (err)
                        {
                            console.log("> Error finding number of users in a company");
                            return cb(err);
                        }
                        
                        var conn = mongoose.createConnection(database.connString, {server: {poolSize: usersCount}}, function(err) {
                            if (err)
                            {
                                var error = {
                                    message: "Failed connecting database"
                                };
                                console.log('> Failed connecting database:', err);
                                return cb(null, error, null);
                            }
                        });
                        
                        DSL.compile(DSLInstance.source, function(err, expanded) {
                            if(err)
                            {
                                console.log("> DSL compilation error:", err);
                                conn.close();
                                return cb(null, err, null);
                            }
                            
                            var callback = function(err, identity, body) {
                                if(err)
                                {
                                    conn.close();
                                    console.log("> DSL execution stopped: compilation errors");
                                    return cb(null, err, null);
                                }
                                else    // compilation successful
                                {
                                    switch(DSLInstance.type)
                                    {
                                        case "Cell":
                                            DSL.executeCell(identity, body, conn, function(error, data){
                                                conn.close();
                                                if(error)
                                                {
                                                    console.log("> DSL execution error:", error);
                                                    return cb(null, error, null);
                                                }
                                                else
                                                {
                                                    console.log("> DSL execution processed successfully");
                                                    if(!data.label)
                                                        data.label = DSLInstance.name;
                                                    data.definitionType = DSLInstance.type;
                                                    return cb(null, null, data);
                                                }
                                            });
                                            break;
                                        case "Document":
                                            DSL.executeDocument(identity, body, conn, function(error, data) {
                                                conn.close();
                                                if (error)
                                                {
                                                    console.log("> DSL execution error:", error);
                                                    return cb(null, error, null);
                                                }
                                                else
                                                {
                                                    console.log("> DSL execution processed successfully");
                                                    if(!data.label)
                                                        data.label = DSLInstance.name;
                                                    data.definitionType = DSLInstance.type;
                                                    return cb(null, null, data);
                                                }
                                            });
                                            break;
                                            
                                        case "Collection":
                                            DSL.executeCollection(identity, body, conn, function(error, data) {
                                                conn.close();
                                                if (error)
                                                {
                                                    console.log("> DSL execution error:", error);
                                                    return cb(null, error, null);
                                                }
                                                else
                                                {
                                                    console.log("> DSL execution processed successfully");
                                                    if(!data.label)
                                                        data.label = DSLInstance.name;
                                                    data.definitionType = DSLInstance.type;
                                                    data.document = body.document;
                                                    return cb(null, null, data);
                                                }
                                            });
                                            break;
                                    }
                                }
                            };
                            try
                            {
                                eval(expanded); // DSL.compile...
                            }
                            catch(err)
                            {
                                conn.close();
                                console.log("> DSL execution stopped:", err);
                                return cb(null, err.toString(), null);
                            }
                        });
                    });
                });
            });
        });
    };
    
    DSL.remoteMethod(
        'executeDefinition',
        {
            description: "Execute a DSL definition",
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
    
    DSL.compileCell = function(identity, body, cb) {
        
    /* -------------------------------- CELL -------------------------------- 
    
    Two types of cell:
        
        1) Cell with value:
            Identity:
                type | required | "string"
                label | optional
                columnLabel | optional
                transformation | optional
            Body:
                value | required
        
        2) Cell without value:
            Identity:
                name | required
                table | required
                label | optional
                transformation | optional
                columnLabel | optional
                type | required | "string"
                sortby | optional
                order | optional | "asc"
                query | optional
            Body:
                empty                       */
        
        if(Object.getOwnPropertyNames(body).length !== 0)   // Cell with a value
        {
            AttributesReader.checkSupportedAttributes(Object.assign(identity, body), ['type', 'label', 'columnLabel', 'transformation', 'value'], function(unsupportedAttributesError) {
                AttributesReader.readRequiredAttributes(body, ['value'], function(missingRequiredBodyAttributesError) {
                    AttributesReader.readRequiredAttributes(identity, ['type', 'columnLabel'], function(missingRequiredIdentityAttributesError) {
                        AttributesReader.checkKeywordValue({type: identity.type, transformation: identity.transformation, value: body.value}, function(keywordValueError) {
                            var error = Object.assign(unsupportedAttributesError, missingRequiredBodyAttributesError, missingRequiredIdentityAttributesError, keywordValueError);
                            if(Object.getOwnPropertyNames(error).length !== 0)
                            {
                                return cb(error, null, null);
                            }
                            else
                            {
                                return cb(null, identity, body);
                            }
                        });
                    });
                });
            });
        }
        else    // Cell without a value
        {
            AttributesReader.checkSupportedAttributes(Object.assign(identity, body), ['name', 'table', 'label', 'columnLabel', 'transformation', 'type', 'sortby', 'order', 'query'], function(unsupportedAttributesError) {
                AttributesReader.readRequiredAttributes(identity, ['type', 'name', 'table'], function(missingRequiredIdentityAttributesError) {
                    var keywordsValue = {
                        type: identity.type, 
                        transformation: identity.transformation,
                        order: identity.order, 
                        query: identity.query,
                        name: identity.name,
                        columnLabel: identity.columnLabel,
                        table: identity.table,
                        sortby: identity.sortby,
                        label: identity.label
                    };
                    AttributesReader.checkKeywordValue(keywordsValue, function(keywordValueError) {
                        var error = Object.assign(unsupportedAttributesError, missingRequiredIdentityAttributesError, keywordValueError);
                        if(Object.getOwnPropertyNames(error).length !== 0)
                        {
                            return cb(error, null, null);
                        }
                        else
                        {
                            return cb(null, identity, body);
                        }
                    });
                });
            });
        }
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
    
    DSL.executeCell = function(identity, body, conn, cb) {
        var data = {};
        data.types = [];
        if(Object.getOwnPropertyNames(body).length === 0)   // cell without value
        {
            var collection = conn.model(identity.table, DocumentSchema);
            var mongoose_query;
            if(identity.query)
            {
                mongoose_query = collection.find(identity.query, { _id: 0});
            }
            else
            {
                mongoose_query = collection.find({}, { _id: 0});
            }
            mongoose_query.setOptions({lean: true});
            mongoose_query.select(identity.name);
            if(identity.order)
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: identity.order == "asc" ? 1 : -1});
                }
                else
                {
                    mongoose_query.sort({[identity.name]: identity.order == "asc" ? 1 : -1});
                }
            }
            else
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: 1});
                }
            }
            mongoose_query.limit(1);
            mongoose_query.exec(function(err, result) {
                if (err)
                {
                    return cb(err, null);
                }
                if(result.length > 0)
                {
                    var keywordsValue = {
                      type: identity.type,
                      value: result[0][identity.name]
                    };
                    
                    AttributesReader.checkKeywordValue(keywordsValue, function(keywordValueError) {
                        if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                        {
                            return cb(keywordValueError, null);
                        }
                        else
                        {
                            if(identity.label)
                            {
                                data.label = identity.label;
                            }
                            data.types.push(identity.type);
                            if (identity.columnLabel)
                            {
                                data.result = [
                                    {
                                       [identity.columnLabel]: result[0][identity.name]
                                    }
                                ];
                            }
                            else
                            {
                                data.result = result;
                            }
                            return cb(null, data);
                        }
                    });
                }
                else
                {
                    return cb(null, data);
                }
            });
        }
        else    // cell with value
        {
            var columnLabel = identity.columnLabel;
            var value = body.value;
            if(identity.label)
            {
                data.label = identity.label;
            }
            data.types.push(identity.type);
            if(identity.transformation)
            {
                var transformedValue;
                try
                {
                    transformedValue = identity.transformation(value);
                }
                catch(err)
                {
                    return cb(err, null);
                }
                AttributesReader.checkKeywordValue({ type: identity.type, value: transformedValue }, function(keywordValueError) {
                    if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                    {
                        return cb(keywordValueError, null);
                    }
                    else
                    {
                        data.result = [
                            {
                               [columnLabel]: transformedValue
                            }
                        ];
                        return cb(null, data);
                    }
                });
            }
            else
            {
                data.result = [
                    {
                       [columnLabel]: value
                    }
                ];
                return cb(null, data);
            }
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
    
    /* -------------------------------- DOCUMENT -------------------------------- 
    
    Document ( 
        table: 'users',
        label: 'Users',
        sortby: 'surname',
        order: 'asc',
        query: {age : { $lt : 40}}
    ) {
        row(
            name: 'surname',
            label: 'Surname',
            type: 'string'
        )
        row(
            name: 'name',
            label: 'Name',
            type: 'string'
        )
        row(
            name: 'orders',
            label: 'Orders',
            type: 'number',
            transformation: function(val) { return val.length; }
        )
    }
    
    two types of independent Document:
    
    1)
        Identity:
            table | required
            label | optional
            sortby | optional
            order | optional | asc
            query | optional
        Body:
            row
            action | optional
    Row:
        Identity:
            name | required
            label | optional
            transformation | optional
            type | required
    
    2)
        Identity:
            table | required
            label | optional
            sortby | optional
            order | optional | asc
            query | optional
        Body:
            action | optional
            
    */
    
    DSL.compileDocument = function(identity, rows, action, nested, cb) {
        var body = {};
        if(!nested)
        {
            AttributesReader.checkSupportedAttributes(identity, ['table', 'label', 'sortby', 'query', 'order'], function(unsupportedIdentityAttributesError) {
                AttributesReader.readRequiredAttributes(identity, ['table'], function(missingRequiredIdentityAttributesError) {
                    var keywords = {
                        table: identity.table,
                        label: identity.label,
                        sortby: identity.sortby,
                        order: identity.order,
                        query: identity.query
                    };
                    AttributesReader.checkKeywordValue(keywords, function(identityKeywordValueError) {
                        AttributesReader.checkSupportedAttributes(action, ['Export', 'SendEmail'], function(unsupportedActionAttributesError) {
                            AttributesReader.checkKeywordValue({Export: action.Export, SendEmail: action.SendEmail}, function(actionKeywordValueError) {
                                if(rows.length !== 0)   // Document with rows
                                {
                                    var returned = false;
                                    
                                    for(var i = 0; !returned && i < rows.length; i++)     // body.forEach(function(row, i) {
                                    {
                                        var row = rows[i];
                                        AttributesReader.checkSupportedAttributes(row, ['name', 'label', 'type', 'transformation'], function(unsupportedRowAttributesError) {
                                            AttributesReader.readRequiredAttributes(row, ['name', 'type'], function(missingRequiredRowAttributesError) {
                                                var keywords = {
                                                    name: row.name,
                                                    label: row.label,
                                                    type: row.type,
                                                    transformation: row.transformation
                                                };
                                                AttributesReader.checkKeywordValue(keywords, function(rowKeywordValueError) {
                                                    var rowError = Object.assign(unsupportedRowAttributesError, missingRequiredRowAttributesError, rowKeywordValueError);
                                                    var error = Object.assign(unsupportedIdentityAttributesError, missingRequiredIdentityAttributesError, 
                                                                              identityKeywordValueError, unsupportedActionAttributesError, actionKeywordValueError, rowError);
                                                    if(Object.getOwnPropertyNames(rowError).length !== 0)
                                                    {
                                                        returned = true;
                                                        return cb(error, null, null);   // return the errors occurred in the first wrong row
                                                    }
                                                    else
                                                    {
                                                        if(i == rows.length-1)  // last row in body, all rows are ok
                                                        {
                                                            if(Object.getOwnPropertyNames(error).length !== 0)    // general errors from above
                                                            {
                                                                returned = true;
                                                                return cb(error, null, null);
                                                            }
                                                            else 
                                                            {
                                                                body = { action: action, rows: rows };
                                                                returned = true;
                                                                return cb(null, identity, body);
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    }
                                }
                                else    //Document without rows
                                {
                                    body = { action: action };
                                    var error = Object.assign(unsupportedIdentityAttributesError, missingRequiredIdentityAttributesError, identityKeywordValueError, 
                                    unsupportedActionAttributesError, actionKeywordValueError);
                                    if(Object.getOwnPropertyNames(error).length !== 0)
                                    {
                                        return cb(error, null, null);
                                    }
                                    else
                                    {
                                        return cb(null, identity, body);
                                    }
                                }
                            });
                        });
                    });
                });
            });
        }
        else    // document inside a collection
        {
            AttributesReader.checkSupportedAttributes(identity, ['populate'], function(unsupportedIdentityAttributesError) {
                AttributesReader.checkKeywordValue({populate: identity.populate}, function(identityKeywordValueError) {
                    AttributesReader.checkSupportedAttributes(action, ['Export', 'SendEmail'], function(unsupportedActionAttributesError) {
                        AttributesReader.checkKeywordValue({Export: action.Export, SendEmail: action.SendEmail}, function(actionKeywordValueError) {
                            if(rows.length !== 0)   // Document with rows
                            {
                                var returned = false;
                                for(var i = 0; !returned && i < rows.length; i++)     // body.forEach(function(row, i) {
                                {
                                    var row = rows[i];
                                    AttributesReader.checkSupportedAttributes(row, ['name', 'label', 'type', 'transformation'], function(unsupportedRowAttributesError) {
                                        AttributesReader.readRequiredAttributes(row, ['name', 'type'], function(missingRequiredRowAttributesError) {
                                            var keywords = {
                                                name: row.name,
                                                label: row.label,
                                                type: row.type,
                                                transformation: row.transformation
                                            };
                                            AttributesReader.checkKeywordValue(keywords, function(rowKeywordValueError) {
                                                var rowError = Object.assign(unsupportedRowAttributesError, missingRequiredRowAttributesError, rowKeywordValueError);
                                                var error = Object.assign(unsupportedIdentityAttributesError, identityKeywordValueError, 
                                                unsupportedActionAttributesError, actionKeywordValueError, rowError);
                                                if(Object.getOwnPropertyNames(rowError).length !== 0)
                                                {
                                                    returned = true;
                                                    return cb(error, null, null);   // return the errors occurred in the first wrong row
                                                }
                                                else
                                                {
                                                    if(i == rows.length-1)  // last row in body, all rows are ok
                                                    {
                                                        if(Object.getOwnPropertyNames(error).length !== 0)    // general errors from above
                                                        {
                                                            returned = true;
                                                            return cb(error, null, null);
                                                        }
                                                        else 
                                                        {
                                                            body = { action: action, rows: rows };
                                                            returned = true;
                                                            return cb(null, identity, body);
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                    });
                                }
                            }
                            else    //Document without rows
                            {
                                body = { action: action };
                                var error = Object.assign(unsupportedIdentityAttributesError, identityKeywordValueError, 
                                unsupportedActionAttributesError, actionKeywordValueError);
                                if(Object.getOwnPropertyNames(error).length !== 0)
                                {
                                    return cb(error, null, null);
                                }
                                else
                                {
                                    return cb(null, identity, body);
                                }
                            }
                        });
                    });
                });
            });
        }
    };
    
    DSL.remoteMethod(
        'compileDocument',
        {
            description: "Compile a Document macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Document identity' },
                { arg: 'rows', type: 'object', required: true, description: 'Document rows' },
                { arg: 'action', type: 'object', required: true, description: 'Document action'}
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'identity', type: 'Object' },
                { arg: 'body', type: 'Object' }
            ]
        }
    );
    
    DSL.executeDocument = function(identity, body, conn, cb) {
        var data = {};
        data.types = [];
        if(Object.getOwnPropertyNames(body.action).length !== 0)
        {
            data.action = body.action;
        }
        var collection = conn.model(identity.table, DocumentSchema);
        var mongoose_query;
        if(!body.rows || (body.rows && body.rows.length == 0) )   // Document without rows
        {
            if(identity.query)
            {
                mongoose_query = collection.find(identity.query, { _id: 0});
            }
            else
            {
                mongoose_query = collection.find({}, { _id: 0});
            }
            mongoose_query.setOptions({lean: true});
            if(identity.order)
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: identity.order == "asc" ? 1 : -1});
                }
                else
                {
                    // if not specified we don't know how to order
                }
            }
            else
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: 1});
                }
            }
            mongoose_query.limit(1);    // take only one document
            mongoose_query.exec(function(err, result) {
                if (err)
                {
                    return cb(err, null);
                }
                //console.log(result);
                if(result.length > 0)
                {
                    data.result = result;   // initialize the object to be filled with results
                    if(identity.label)
                    {
                        data.label = identity.label;
                    }
                    
                    return cb(null, data);
                }
                else
                {
                    return cb(null, data);
                }
            });
        }
        else if(body.rows && body.rows.length > 0)    //Document with rows
        {
            if(identity.query)
            {
                mongoose_query = collection.find(identity.query, { _id: 0});
            }
            else
            {
                mongoose_query = collection.find({}, { _id: 0});
            }
            mongoose_query.setOptions({lean: true});
            var names = "";
            body.rows.forEach(function(row) {
                names += " " + row.name;
            });
            mongoose_query.select(names);
            if(identity.order)
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: identity.order == "asc" ? 1 : -1});
                }
                else
                {
                    mongoose_query.sort({[body.rows[0].name]: identity.order == "asc" ? 1 : -1});    // if not specified, sort by the first row attribute
                }
            }
            else
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: 1});
                }
            }
            mongoose_query.limit(1);    // take only one document
            mongoose_query.exec(function(err, result) {
                if (err)
                {
                    return cb(err, null);
                }
                if(result.length > 0)
                {
                    data.result = [ {} ];   // initialize the object to be filled with results matching rows values
                    if(identity.label)
                    {
                        data.label = identity.label;
                    }
                    var i = 0;
                    var returned = false;
                    while(i < body.rows.length && !returned)
                    {
                        var row = body.rows[i];
                        var rowValue = result[0][row.name];
                        
                        data.types.push(row.type);
                        
                        if(row.transformation)
                        {
                            var transformedValue;
                            try
                            {
                                transformedValue = row.transformation(rowValue);
                            }
                            catch(err)
                            {
                                returned = true;
                                return cb(err, null);
                            }
                            AttributesReader.checkKeywordValue({ type: row.type, value: transformedValue }, function(keywordValueError) {
                                if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                                {
                                    returned = true;
                                    return cb(keywordValueError, null);
                                }
                                else
                                {
                                    if(row.label)
                                    {
                                        data.result[0][row.label] = transformedValue;
                                    }
                                    else
                                    {
                                        data.result[0][row.name] = transformedValue;
                                    }
                                    
                                    if(i == body.rows.length-1)  // if all rows are checked then returns
                                    {
                                        //console.log(data)
                                        returned = true;
                                        return cb(null, data);
                                    }
                                    else    // if there are other rows to check
                                    {
                                        i++;
                                    }
                                }
                            });
                        }
                        else
                        {
                            AttributesReader.checkKeywordValue({ type: row.type, value: rowValue }, function(keywordValueError) {
                                if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                                {
                                    returned = true;
                                    return cb(keywordValueError, null);
                                }
                                else
                                {
                                    if(row.label)
                                    {
                                        data.result[0][row.label] = rowValue;
                                    }
                                    else
                                    {
                                        data.result[0][row.name] = rowValue;
                                    }
                                    
                                    if(i == body.rows.length-1)  // if all rows are checked then returns
                                    {
                                        //console.log(data)
                                        returned = true;
                                        return cb(null, data);
                                    }
                                    else    // if there are other rows to check
                                    {
                                        i++;
                                    }
                                }
                            });
                        }
                    }
                }
                else
                {
                    return cb(null, data);
                }
            });
        }
    };
    
    DSL.remoteMethod(
        'executeDocument',
        {
            description: "Execute a Document macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Document identity' },
                { arg: 'body', type: 'object', required: true, description: 'Document body' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
            ]
        }
    );
    
    /* -------------------------------- COLLECTION --------------------------------
    
    Two types of Collection:
    
    1)
        Identity:
            table | required
            label | optional
            sortby | optional
            query | optional
            order | optional
            perpage | optional
        Body:
            action | optional
            column | optional
        
    2)
        Identity:
            table | required
            label | optional
            sortby | optional
            query | optional
            order | optional
            perpage | optional
        Body:
            action | optional
            column | optional
            document
            
        Column:
            name | required
            selectable | optional | false
            sortable | optional | false
            type | required | false
            label | optional
            transformation | optional
            
    Two types of Document inside Collection (if defined):
    
    1)
        Identity:
            populate | optional
        Body:
            row
    Row:
        Identity:
            name | required
            label | optional
            transformation | optional
            type | required
            
    2)
        Identity:
            populate | optional
        Body:
            empty
        
    */
/*
Collection(
    table: "customers",
    label: "JuniorCustomers",
    ---------id: "Junior",
    ---------Weight:"0",
    perpage: "20",
    sortby: "surname",
    order: "asc",
    query: {age: {$lt: 40}}
) {
    column(
        name: "3"
    )
    action(
        Export: "true",
        SendEmail: "true"
    )
    column(
        name: "4"
    )
    Document(
        table: "prova"
    ){
        row(
            name: "asd"
        )
        action(
            SendEmail: "true"
        )
    }   
    column(
        name: "5"
    )
}
*/
    DSL.compileCollection = function(identity, columns, document, action, cb) {
        var body = {};
        AttributesReader.checkSupportedAttributes(identity, ['table', 'label', 'sortby', 'order', 'query', 'perpage'], function(unsupportedIdentityAttributesError) {
            AttributesReader.readRequiredAttributes(identity, ['table'], function(missingRequiredIdentityAttributesError) {
                var keywords = {
                    table: identity.table,
                    label: identity.label,
                    sortby: identity.sortby,
                    order: identity.order,
                    query: identity.query,
                    perpage: identity.perpage
                };
                AttributesReader.checkKeywordValue(keywords, function(identityKeywordValueError) {
                    AttributesReader.checkSupportedAttributes(action, ['Export', 'SendEmail'], function(unsupportedActionAttributesError) {
                        AttributesReader.checkKeywordValue({Export: action.Export, SendEmail: action.SendEmail}, function(actionKeywordValueError) {
                            if(columns.length > 0)
                            {
                                var stop = false;
                                for (var i = 0; !stop && i< columns.length; i++)
                                {
                                    var column = columns[i];
                                    AttributesReader.checkSupportedAttributes(column, ['name', 'label', 'type', 'selectable', 'sortable', 'transformation'], function(unsupportedColumnAttributesError) {
                                        AttributesReader.readRequiredAttributes(column, ['name', 'type'], function(missingRequiredColumnAttributesError) {
                                            var keywords = {
                                                name: column.name,
                                                label: column.label,
                                                selectable: column.selectable,
                                                sortable: column.sortable,
                                                transformation: column.transformation
                                            };
                                            AttributesReader.checkKeywordValue(keywords, function(columnKeywordValueError) {
                                                var columnError = Object.assign(unsupportedColumnAttributesError, missingRequiredColumnAttributesError, columnKeywordValueError);
                                                var error = Object.assign(columnError, unsupportedIdentityAttributesError, missingRequiredIdentityAttributesError,
                                                identityKeywordValueError, unsupportedActionAttributesError, actionKeywordValueError);
                                                if(Object.getOwnPropertyNames(columnError).length !== 0)
                                                {
                                                    stop = true;
                                                    return cb(error, null, null);   // return the errors occurred in the first wrong column
                                                }
                                                else    // no column error
                                                {
                                                    if (i == columns.length-1)
                                                    {
                                                        if(Object.getOwnPropertyNames(document).length === 0)   // collection without explicit document
                                                        {
                                                            if(Object.getOwnPropertyNames(error).length !== 0)    // general errors from above
                                                            {
                                                                stop = true;
                                                                return cb(error, null, null);
                                                            }
                                                            else 
                                                            {
                                                                body = {
                                                                    action: action,
                                                                    columns: columns,
                                                                    document: {}
                                                                };
                                                                stop = true;
                                                                return cb(null, identity, body);
                                                            }
                                                        }
                                                        else    // collection with explicit document
                                                        {
                                                            DSL.compileDocument(document.identity, document.rows, document.action, true, function(documentCompileError, documentIdentity, documentBody) {
                                                                error = Object.assign(error, documentCompileError); // general errors from above + document errors
                                                                if(Object.getOwnPropertyNames(error).length !== 0)
                                                                {
                                                                    stop = true;
                                                                    return cb(error, null, null);
                                                                }
                                                                else 
                                                                {
                                                                    body = { 
                                                                        action: action,
                                                                        columns: columns,
                                                                        document: {
                                                                            identity: documentIdentity,
                                                                            body: documentBody
                                                                        }
                                                                    };
                                                                    stop = true;
                                                                    return cb(null, identity, body);
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            });
                                        });
                                    });
                                }
                            }
                            else
                            {
                                var error = Object.assign(unsupportedIdentityAttributesError, missingRequiredIdentityAttributesError,
                                                identityKeywordValueError, unsupportedActionAttributesError, actionKeywordValueError);
                                                
                                if(Object.getOwnPropertyNames(document).length === 0)   // collection without explicit document
                                {
                                    if(Object.getOwnPropertyNames(error).length !== 0)    // general errors from above
                                    {
                                        stop = true;
                                        return cb(error, null, null);
                                    }
                                    else 
                                    {
                                        body = {
                                            action: action,
                                            columns: columns,
                                            document: {}
                                        };
                                        stop = true;
                                        return cb(null, identity, body);
                                    }
                                }
                                else    // collection with explicit document
                                {
                                    DSL.compileDocument(document.identity, document.rows, document.action, true, function(documentCompileError, documentIdentity, documentBody) {
                                        error = Object.assign(error, documentCompileError); // general errors from above + document errors
                                        if(Object.getOwnPropertyNames(error).length !== 0)
                                        {
                                            stop = true;
                                            return cb(error, null, null);
                                        }
                                        else 
                                        {
                                            body = { 
                                                action: action,
                                                columns: columns,
                                                document: {
                                                    identity: documentIdentity,
                                                    body: documentBody
                                                }
                                            };
                                            stop = true;
                                            return cb(null, identity, body);
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            });
        });
    };
    
    DSL.remoteMethod(
        'compileCollection',
        {
            description: "Compile a Collection macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Collection identity' },
                { arg: 'columns', type: 'object', required: true, description: 'Collection columns' },
                { arg: 'document', type: 'object', required: true, description: 'Collection document' },
                { arg: 'action', type: 'object', required: true, description: 'Collection action'}
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'identity', type: 'Object' },
                { arg: 'body', type: 'Object' }
            ]
        }
    );
    
    DSL.executeCollection = function(identity, body, conn, cb) {
        var data = {};
        data.perpage = identity.perpage;
        data.types = [];
        data.selectables = [];
        data.sortables = [];
        if(Object.getOwnPropertyNames(body.action).length !== 0)
        {
            data.action = body.action;
        }
        var collection = conn.model(identity.table, DocumentSchema);
        var mongoose_query;
        if(!body.columns || (body.columns && body.columns.length == 0) )   // Collection without columns
        {
            if(identity.query)
            {
                mongoose_query = collection.find(identity.query, { _id: 0});
            }
            else
            {
                mongoose_query = collection.find({}, { _id: 0});
            }
            mongoose_query.setOptions({lean: true});
            if(identity.order)
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: identity.order == "asc" ? 1 : -1});
                }
                else
                {
                    // if not specified we don't know how to order
                }
            }
            else
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: 1});
                }
            }
            mongoose_query.exec(function(err, result) {
                if (err)
                {
                    return cb(err, null);
                }
                if(result.length > 0)
                {
                    data.result = result;   // initialize the object to be filled with results
                    if(identity.label)
                    {
                        data.label = identity.label;
                    }
                    return cb(null, data);
                }
                else
                {
                    return cb(null, data);
                }
            });
        }
        else if(body.columns && body.columns.length > 0)    // Collection with columns
        {
            if(identity.query)
            {
                mongoose_query = collection.find(identity.query, { _id: 0});
            }
            else
            {
                mongoose_query = collection.find({}, { _id: 0});
            }
            mongoose_query.setOptions({lean: true});
            var names = "";
            body.columns.forEach(function(column) {
                names += " " + column.name;
            });
            mongoose_query.select(names);
            if(identity.order)
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: identity.order == "asc" ? 1 : -1});
                }
                else
                {
                    mongoose_query.sort({[body.columns[0].name]: identity.order == "asc" ? 1 : -1});    // if not specified, sort by the first column attribute
                }
            }
            else
            {
                if(identity.sortby)
                {
                    mongoose_query.sort({[identity.sortby]: 1});
                }
            }
            mongoose_query.exec(function(err, results) {
                if (err)
                {
                    return cb(err, null);
                }
                if(results.length > 0)
                {
                    data.result = [ {} ];   // initialize the object to be filled with results matching rows values
                    if(identity.label)
                    {
                        data.label = identity.label;
                    }
                    
                    var column;
                    for(var i = 0; i < body.columns.length; i++)
                    {
                        column = body.columns[i];
                        data.types.push(column.type);
                            
                        if(column.sortable)
                        {
                            data.sortables.push(column.sortable);
                        }
                        else
                        {
                            data.sortables.push(false);
                        }
                        
                        if(column.selectable)
                        {
                            data.selectables.push(column.selectable);
                        }
                        else
                        {
                            data.selectables.push(false);
                        }
                    }
                    
                    var returned = false;
                    for(var x = 0; !returned && x < results.length; x++)   // check all documents resulted form query
                    {
                        data.result[x] = {};
                        for(var i = 0; !returned && i < body.columns.length; i++)
                        {
                            column = body.columns[i];
                            var columnValue = results[x][column.name];
                            
                            if(column.transformation)
                            {
                                var transformedValue;
                                try
                                {
                                    transformedValue = column.transformation(columnValue);
                                }
                                catch(err)
                                {
                                    returned = true;
                                    return cb(err, null);
                                }
                                AttributesReader.checkKeywordValue({ type: column.type, value: transformedValue }, function(keywordValueError) {
                                    if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                                    {
                                        returned = true;
                                        return cb(keywordValueError, null);
                                    }
                                    else
                                    {
                                        if(column.label)
                                        {
                                            data.result[x][column.label] = transformedValue;
                                        }
                                        else
                                        {
                                            data.result[x][column.name] = transformedValue;
                                        }
                                    }
                                });
                            }
                            else
                            {
                                AttributesReader.checkKeywordValue({ type: column.type, value: columnValue }, function(keywordValueError) {
                                    if(Object.getOwnPropertyNames(keywordValueError).length !== 0)
                                    {
                                        returned = true;
                                        return cb(keywordValueError, null);
                                    }
                                    else
                                    {
                                        if(column.label)
                                        {
                                            data.result[x][column.label] = columnValue;
                                        }
                                        else
                                        {
                                            data.result[x][column.name] = columnValue;
                                        }
                                    }
                                });
                            }
                        }
                        if(x == results.length-1)
                        {
                            returned = true;
                            if(data.selectables.length > 0)
                                data.rawData = results;
                            return cb(null, data);
                        }
                    }
                }
                else
                {
                    return cb(null, data);
                }
            });
        }
    };
    
    DSL.remoteMethod(
        'executeCollection',
        {
            description: "Execute a Collection macro",
            isStatic: true,
            accepts : [
                { arg: 'identity', type: 'object', required: true, description: 'Collection identity' },
                { arg: 'body', type: 'object', required: true, description: 'Collection body' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
            ]
        }
    );
    
    
    
    
    
    
    
    
    
   /* 
    
    Collection(
    
    ) {
        column (
            
        )
        column (
            
        )
        Document(
        ) {
            row ()              => DSL.compileDocument()            
            row ()
        }
    }
    
    // compile definition
    
    var collectionCB = function() {
        
    }
    
    var callback = function() {     // document cb
            
        }
    
    => DSL.compileCollection({}, [], DSL.compileDocument({}, [], callback), collectionCB )
    
    DSL.compileCollection(identity, body, documentCompile, cb)
    {
        
        
        eval(documentCompile);
        
        return documentCB();
    }
    
    compileDocument(identity, body, cb)
    {
        
        
        
    }
    
    function(asd, asd) {
        asdasd
    }
    
    
    
    
    
    
    
    
Collection(
    name: "customers",
    label: "JuniorCustomers",
    id: "Junior",
    Weight:"0",
    perpage: "20",
    sortby: "surname",
    order: "asc",
    query: {age: {$lt: 40}}
) {
    column(
        name: "name",
        label: "Nome",
        sortable: false,
        selectable: false
        transformation: function(val) {
            return val.lenght;
        }
    )
    action(
        Export: "true",
        SendEmail: "true"
    )
    Document(

    ) {
        row(
            name: "name",
            label: "Nome"
        )
    }
}
    
    */
};