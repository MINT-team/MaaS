var app = require('../../server/server.js');
var sweet = require('sweet.js');
var fs = require('fs');

module.exports = function(DSL) {
    
    /*DSL.compile = function(dsl, cb) {
        var intepreterFile = __dirname + "/macro.sjs";
        var expanded;
        fs.readFile(intepreterFile, function(err, macro) {
            if(err)
            {
                console.log("> Errore:", err);
                //return cb(err);
            }
            else
            {
                macro = macro.toString();
                expanded = sweet.compile(macro + dsl);
                console.log(expanded);
                cb(null,expanded.code);
                //eval(expanded.code);
                
                //res = expanded.code;
            }
        });
        
        //return res;
    };
    */
    /*
    var dsl = "cell (sortby: \"surname\",type: \"string\",order: \"asc\",query: {age: {$lt: 40}}){value: \"user\"}";
    var intepreterFile = __dirname + "/macro.sjs";
        var expanded;
        fs.readFile(intepreterFile, function(err, macro) {
            if(err)
            {
                console.log("> Errore:", err);
                //return cb(err);
            }
            else
            {
            */
                /*
                console.log(expanded.code) =
                
                identity: {
                  sortby: "surname"_, _;
                  type: "string"_, _;
                  order: "asc"_, _;
                query: {age: {$lt: 40}}}
                _, _;
                body: {
                value: "user"}
                
                "identity: {  sortby: "surname",   type: "string",   order: "asc", query: {age: {$lt: 40}}}, body: {value: "user"}"
                
                */
                /*
                macro = macro.toString();
                expanded = sweet.compile(macro + dsl);
                var res = JSON.stringify(expanded.code);
                res = res.replace(/_,/g, ",");
                res = res.replace(/_;/g, "");
                res = res.replace(/\\n/g, "");
                res = res.replace(/\\/g, "");
                res = res.replace("\"", "");
                res = res.replace("}\"", "}");
                res = res.replace("identity", "\"identity\"");
                res = res.replace("sortby", "\"sortby\"");
                res = res.replace("type", "\"type\"");
                res = res.replace("order", "\"order\"");
                res = res.replace("query", "\"query\"");
                res = res.replace("body", "\"body\"");
                res = res.replace("value", "\"value\"");
                res = res.replace(/ /g, "");
                //res = res.replace(/"/g, "'");
                console.log(res);
                
                
                // res = JSON.stringify(res);
                // res = JSON.stringify(res);
                // console.log(res);
                var code = JSON.parse("{"+res+"}");
                console.log(code);
                // console.log(JSON.stringify(code.toString()));
                // console.log(typeof code);
                // console.log(JSON.parse(code));
                //cb(null,expanded.code);
                //eval(expanded.code);
                
                //res = expanded.code;
            }
        });
    */
    //DSL.compile(dsl, );
    /*DSL.findById("57ac8a5b0e9fb83d6001430b", function(err, DSLInstance) {
        var code = DSLInstance.compile(dsl);
        console.log("> Code:", code);
        eval(code);
    });*/
    
    
    
    
    // Create a DSL definition
    DSL.saveDefinition = function(userId ,type, name, source, cb) {
        
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
        DSL.create({type: type, name: name, source: source, createdBy: userId}, function(err, DSLInstance) {
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
                { arg: 'source', type: 'string', required: true, description: 'Definition source' }
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
        macro collection {
	case {
		$collection_keyword ( $($key:ident : $val:expr) (,) ... ) { $body ... }
	} => {
		var _collection = makeIdent("_collection", #{$collection_keyword});
		letstx $_collection = [_collection];
		var collectionModel = makeIdent("collectionModel", #{$collection_keyword});
		letstx $collectionModel = [collectionModel];
		
		return #{ {
			var $_collection = new DslCollectionModel(domain, {
				$($key: $val) (,) ...
			});
			registerCollection($_collection);
			$body ...
		} };
	}

    
    
    */
    
    DSL.executeCell = function(cb) {
        console.log('funzia');
    };
    
    DSL.remoteMethod(
        'executeCell',
        {
            description: "Execute a Cell macro",
            isStatic: true,
            accepts : [
                { arg: 'data', type: 'object', required: true, description: 'Cell properties' }
            ]
        }
    
    );
    
    
    /*
    
        DSL.executeCell( expanded );
        expanded = {
            identity: {
                sortby: {},
                type: {},
                query: {lsffef}
            },
            body: {}
        }
        expanded.identity.query
        
        
        
        {
          identity: {
          sortby: "surname"type: "string"order: "asc"query: {age: {$lt: 40}}}
          body: {
          value: "user"}
        }

    */
    
    
    DSL.executeDefinition = function(id, type, cb) {
        /*DSL.findById(id, function(err, DSLInstance) {
            DSL.executeCell();
            
            
        });
        */
        /*
        if(db.conncted)
        {
            // fai connessione
            // switch
        }
        */
        switch (type) {
            case 'Cell':
                
                break;
                
            case 'Document':
                break;
                
            case 'Collection':
                break;
                
            case 'Dashboard':
                break;
        }
    };
    
    DSL.remoteMethod(
        'executeDefinition',
        {
            description: "Change the permissions for one specific DSL definition",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'Definition id' },
                { arg: 'type', type: 'string', required: true, description: 'Definition type' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'data', type: 'Object' }
                
            ],
            http: { verb: 'post', path: '/:id/executeDefinition' }
        }
        
    );
    
    
    /*
    1) Carico il file interprete del dsl (.sjs) contente le macro sweet.js, utilizzando il fs di loopback in una variabile, 
    la quale verrà utilizzata dalla funzione di sweet.js per caricare i moduli di macro;
    2) Carico la source del codice dsl in una variabile;
    3) Utilizzo la funzione compile di sweet.js per compilare il codice, la quale mi ritorna tutto il codice della collection espanso
    in javascript normale, se non ci sono stati errori. (Altrimenti errore di compilazione)
    4) per eseguire il codice js dentro la variabile si usa la funzione eval().
    
    Bisogna creare delle funzioni per ogni elemento del dsl, le quali si occuperanno di verificare se ci sono errori e ritorneranno un
    json contenente la struttura e i dati da visualizzare. Queste funzioni possono utilizzare altre funzioni di altri elementi innestati.
    Bisogna pensare a come compilare il codice del dsl, in quanto la compilazione di sweet js non controlla errori nella chiamata
    delle macro.
    
    */
};