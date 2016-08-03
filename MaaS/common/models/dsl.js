var app = require('../../server/server.js');

module.exports = function(DSL) {
    DSL.saveDefinition = function(type, name, source, cb) {
        if(!type || !name)
        {
            var error = {
                message: "Missing data for DSL creation"
            };
            return cb(null, error, null);
        }
        DSL.create({type: type, name: name, source: source}, function(err, DSL) {
            if (err)
            {
               //DSL.destroyById(DSL.id);
               console.log('> Failed creating DSL.');
               return cb(err);
            }
            console.log("> Created DSL:", DSL.id);
            return cb(null, null, DSL);
       });
    };
    
    DSL.remoteMethod(
        'saveDefinition',
        {
            description: "Change user's editor configuration options",
            accepts: [
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
    
    DSL.overwriteDefinition = function(id, source, cb) {
       DSL.findById(id, function(err, DSL) {
           if(err) return cb(err, null, null);
           DSL.updateAttribute(source, source, function(err, newDSL) {
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
