module.exports = {
    
    missingRequiredAttributes: function(missingAttributes, cb) {
        var error = {
                message: "Required attributes missing:"
        };
        missingAttributes.map((attr) => error.message += ' \''+attr+'\'');
        return cb(error);
    },

    noNameError: function() {
        
    },
    wrongTypeError: function() {
        
    }
};