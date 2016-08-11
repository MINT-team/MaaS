var app = require('../../server/server.js');
var sweet = require('sweet.js');
var fs = require('fs');
//var hi = require('./macro.sjs');

require("babel-core/register");

import { hi } from './macro.js';
// da qui usa Babel

module.exports = function(DSL) {
    
    console.log(hi);
    /*

out = sweetjs.compile(content, {
			modules: [this.macro]
		});

var intepreterFile = __dirname + "/macro.sjs";

var DslConcreteStrategy = function() {
	this.macro = null;
};

DslConcreteStrategy.prototype.init = function(callback, errback) {
	var self = this;
	fs.readFile(intepreterFile, function(err, data) {
		if (err) {
			errback(new MaapError(err));
		}
		else {
			self.macro = sweetjs.loadModule(data);
			callback();
		}
	});
};


*/

/*
(Str, {
        sourceMap: Bool,
        filename: Str,
        readableNames: Bool,
        maxExpands: Num
    }) -> {
        code: Str,
        sourceMap: Str
    }
sweet.compile(code, options)
Parameters:

code the code to expand
options options object:
sourceMap if true generate a source map
filename file name of the source file to go into the source map
readableNames clean up variables that were renamed from hygiene (foo$100 becomes foo where ever possible). Only supports ES5 code.
maxExpands maximum number of times to expand macros. Used to implement macro stepping.



*/
    
    
       /*
    
    syntax new = function (ctx) {
  return #`{var x = 10;}`;
}

new
    
    */
    
    /*
    var intepreterFile = __dirname + "/macro.sjs";
    fs.readFile(intepreterFile, function(err, data) {
        if(err)
        {
            console.log("> Errore:", err);
        }
        else
        {
            var dsl = "hi";
            console.log(intepreterFile);
            //console.log('File macro trovato:');
            var dsl = "syntax hi = function (ctx) { return #`console.log('hello, world!')`; }";
            
            var expanded = sweet.compile(dsl, {
                                                sourceMap: false,
                                                moduleLoader: intepreterFile,
                                                readableNames: true,
                                                maxExpands: 10 });
                                           
            // compile(source, {
            //     cwd: '.',
            //     transform,
            //     moduleResolver: x => x,
            //     moduleLoader: path => loader[path],
            //     includeImports: false
            //   });
            console.log(expanded);
            
        }
        
    });
    
    // -----------------------------------------
    
    
    
    
    
    */
    
    
    
    
    

    // Create a DSL definition
    DSL.saveDefinition = function(userId ,type, name, source, cb) {
        
        // Clear and returns the error
        function relationError(DSLInstance, err) {
            DSL.destroyById(DSLInstance.id, function(err) {
                if(err) 
                    return cb(err, null, null);
            })
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
    
    DSL.overwriteDefinition = function(id, type, source, cb) {
        DSL.findById(id, function(err, DSL) {
            if(err)
                return cb(err, null, null);
            DSL.updateAttributes({type: type, source: source}, function(err, newDSL) {
                if(err)
                    return cb(err, null, null);
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
                { arg: 'source', type: 'string', required: true, description: 'Definition source' }
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
    
    DSL.executeDefinition = function(id, type, cb) {
        
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
            http: { verb: 'put', path: '/:id/executeDefinition' }
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


