module.exports = {
    
    missingRequiredAttributes: function(missingAttributes, cb) {
        var error = {
                missingRequiredAttributesMessage: "Required attributes missing:"
        };
        missingAttributes.map((attr) => error.missingRequiredAttributesMessage += ' \''+attr+'\'');
        return cb(error);
    },
    
    wrongTypeError: function(type, cb) {
        var error = {
                wrongTypeErrorMessage: "Type error: " + type + " is not a keyword"
        };
        return cb(error);
    },
    
    orderError: function(order, cb) {
        var error = {
                wrongTypeErrorMessage: "Order error: " + order + " is not a keyword. It must be \'asc\' or \'desc\'"
        };
        return cb(error);
    }
};