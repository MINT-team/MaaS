var CompileErrors = require('./compileErrors.js');

module.exports = {
    // readOptionalAttributes: function(source, optional, cb) {
    //     var result = {};
    //     for (var i=0; i<optional.length; i++)
    //     {
    // 		var attr = optional[i];
    
    // 		if (source[attr] !== undefined)
    // 		{
    // 			result[attr] = source[attr];
    // 			continue;
    // 		}
	   // }
	   // return cb(result);
    // },
    
    readRequiredAttributes: function(source, required, cb) {
        var missingAttributes = [];
        for(var i = 0; i < required.length; i++)
        {
		    var attr = required[i];
		    if(source[attr] === undefined)
		    	missingAttributes.push(attr);
	    }
	    CompileErrors.missingRequiredAttributes(missingAttributes, function(err) {
	    	return cb(err);
	    });
    },
    
    checkSupportedAttributes: function(source, supported, cb) {
    	var wrongAttributes = [];
    	var attributes = Object.keys(source);
    	for(var i = 0; i < attributes.length; i++)
        {
        	var found = false;
        	for(var j = 0; !found && j < supported.length; j++)
        	{
	        	if(attributes[i] == supported[j])
	        		found = true;
        	}
        	if(!found)
        		wrongAttributes.push(attributes[i]);
        }
        CompileErrors.unsupportedAttributesError(wrongAttributes, function(err) {
        	return cb(err);	
        });
    },
    
    checkKeywordValue: function(keywords, cb) {
    	var type = keywords.type;
    	var order = keywords.order;
    	var transformation = keywords.transformation;
    	var query = keywords.query;
    	var value = keywords.value;
    	var name = keywords.name;
    	var label = keywords.label;
    	var sortby = keywords.sortby;
    	var table = keywords.table;
    	var columnLabel = keywords.columnLabel;
    	
        var error = {};
        if(name && (typeof name !== 'string'))
        {
        	error.notStringErrorMessage = CompileErrors.notStringErrorMessage(name);
        }
        
        if(label && (typeof label !== 'string'))
        {
        	error.notStringErrorMessage = CompileErrors.notStringErrorMessage(label);
        }
        
        if(sortby && (typeof sortby !== 'string'))
        {
        	error.notStringErrorMessage = CompileErrors.notStringErrorMessage(sortby);
        }
        
        if(table && (typeof table !== 'string'))
        {
        	error.notStringErrorMessage = CompileErrors.notStringErrorMessage(table);
        }
        
        if(columnLabel && (typeof columnLabel !== 'string'))
        {
        	error.notStringErrorMessage = CompileErrors.notStringErrorMessage(col);
        }
        
        if(type && (type != 'string' && type != 'image' && type != 'number' && type != 'link' && type != 'date') )
        {
            error.wrongTypeErrorMessage = CompileErrors.wrongTypeError(type);
        }
        
        if(order && (order != 'asc' && order != 'desc'))
        {
            error.wrongOrderErrorMessage = CompileErrors.orderError(order);
        }
        
        if(transformation && (typeof transformation !== 'function') )
        {
            error.wrongTransformationErrorMessage = CompileErrors.transformationError(transformation);
        }
        
        if(query && (typeof query !== 'object') )
        {
            error.wrongQueryErrorMessage = CompileErrors.queryError(query);
        }
        
        if(value)
        {
        	switch (type) {
        		case 'string':
        			if(typeof value != 'string')
        			{
        				error.typeMismatchErrorMessage = CompileErrors.typeMismatchError(type);
        			}
        			break;
        			
        		case 'number':
        			if (isNaN(value)) {
        				error.typeMismatchErrorMessage = CompileErrors.typeMismatchError(type);
        			}
        			break;
        			
        		case 'link':
        			// string.link("url")
        			break;
        			
        		case 'date':
        			var d = new Date(value);
        			if(isNaN(d.getTime())) {
        				error.typeMismatchErrorMessage = CompileErrors.typeMismatchError(type);
        			}
        			break;
        			
        		case 'image':
        			
        			break;
        	}
        }
        return cb(error);
    },
    
    checkDocumentKeywordValue: function(keywords, cb) {
        
    }
};