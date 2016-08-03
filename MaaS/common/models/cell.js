var app = require('../../server/server.js');

module.exports = function(Cell) {
    Cell.saveDefinition = function(name, source, cb) {
        if(!name || !source)
        {
            var error = {
                message: "Missing data for Cell creation"
            };
            return cb(null, error, null);
        }
        Cell.create({name: name, source: source}, function(err, cell) {
            if (err)
            {
               Cell.destroyById(cell.id);
               console.log('> Failed creating Cell.');
               return cb(err);
            }
            console.log("> Cell created:", cell.id);
            return cb(null, null, cell);
       });
    };
    
    Cell.remoteMethod(
        'saveDefinition',
        {
            description: "Change user's editor configuration options",
            accepts: [
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
    
    Cell.overwriteDefinition = function(id, source, cb) {
       Cell.findById(id, function(err, cell) {
           if(err) return cb(err, null, null);
           cell.updateAttribute(source, source, function(err, newCell) {
               if(err) return cb(err, null, null);
               console.log("> Updated Cell:", newCell.id);
               return cb(null, null, newCell);
           });
       });
    };
    
    Cell.remoteMethod(
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
