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
    },
    
    wrongCellKeywordValueError: function(order, type, transformation, cb) {
        var error;
        if (type)
        {
            if (type != 'string' || type != 'image' || type != 'number' || type != 'link' || type != 'date')
            {
                error.wrongTypeErrorMessage = "Type error: " + type + " is not a type";
                
            }
        }
        if (order)
        {
            if (order != 'asc' || order != 'desc')
            {
                error.wrongOrderErrorMessage = "Order error: " + order + " is not a keyword. It must be \'asc\' or \'desc\'";
            }
        }
        if (transformation)
        {
            if (typeof transformation !== 'function')
            {
                error.wrongTransformationErrorMessage = "Transformation error: " + transformation + "is not a function";
            }
        }
        return cb(error);
    }
};