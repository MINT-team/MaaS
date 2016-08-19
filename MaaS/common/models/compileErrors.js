module.exports = {
    
    missingRequiredAttributes: function(missingAttributes, cb) {
        var error = {};
        if(missingAttributes.length > 0)
        {
            error.missingRequiredAttributesMessage = "Required attribute missing:";
            missingAttributes.forEach(function(attr, i) {
                error.missingRequiredAttributesMessage += ' \''+attr+'\'';
                if(i < missingAttributes.length-1)
                    error.missingRequiredAttributesMessage += ',';
                    
            });
        }
        return cb(error);
    },
    
    unsupportedAttributesError: function(unsupportedAttributes, cb) {
        var error = {};
        if(unsupportedAttributes.length > 0)
        {
            error.unsupportedAttributesMessage = "Unsupported keyword:";
            unsupportedAttributes.forEach(function(attr, i) {
                error.unsupportedAttributesMessage += ' \''+attr+'\'';
                if(i < unsupportedAttributes.length-1)
                    error.unsupportedAttributesMessage += ',';
                    
            });
        }
        return cb(error);
    },
    
    wrongTypeError: function(type) {
        return "Type error: " + type + " is not a type";
    },
    
    queryError: function(query) {
        return "Query error: " + query + " is not an object";
    },
    
    orderError: function(order) {
        return "Order error: " + order + " is not a keyword. It must be \'asc\' or \'desc\'";
    },
    
    transformationError: function(transformation) {
        return "Transformation error: " + transformation + "is not a function";
    },
    
    typeMismatchError: function(type) {
        return "Type mismatch: value is not " + type;
    },
    
    notStringError: function(value) {
        return "Type error: " + value + "must be a string";
    }
};