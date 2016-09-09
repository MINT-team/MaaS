var CompileErrors = require('./compileErrors.js');

module.exports = {
    
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
    	var perpage = keywords.perpage;
    	var columnLabel = keywords.columnLabel;
    	var Export = keywords.Export;
    	var SendEmail = keywords.SendEmail;
    	var selectable = keywords.selectable;
    	var sortable = keywords.sortable;
    	var populate = keywords.populate;
    	var height = keywords.height;
    	var width = keywords.width;
    	
        var error = {};
        if(name && (typeof name !== 'string'))
        {
        	error.wrongNameErrorMessage = CompileErrors.notStringError(name);
        }
        
        if(label && (typeof label !== 'string'))
        {
        	error.wrongLabelErrorMessage = CompileErrors.notStringError(label);
        }
        
        if(sortby && (typeof sortby !== 'string'))
        {
        	error.wrongSortbyErrorMessage = CompileErrors.notStringError(sortby);
        }
        
        if(table && (typeof table !== 'string'))
        {
        	error.wrongTableErrorMessage = CompileErrors.notStringError(table);
        }
        
        if(columnLabel && (typeof columnLabel !== 'string'))
        {
        	error.wrongColumnLabelErrorMessage = CompileErrors.notStringError(columnLabel);
        }
        
        if(type && (type != 'string' && type != 'number' && type != 'date' && type != 'array' && type != 'object' && type.type != 'link' && type.type != 'image') )
        {
            if (type == 'string' || type == 'number' || type == 'date' || type == 'array' || type == 'object')
            {
                error.wrongTypeErrorMessage = CompileErrors.wrongTypeError(type);
            }
            else if (type.type == 'image' || type.type == 'link')
            {
                error.wrongTypeErrorMessage = CompileErrors.wrongTypeError(type.type);
            }
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
        
        if(perpage && (typeof perpage !== 'number'))
        {
            error.wrongPerpageErrorMessage = CompileErrors.perpageError(perpage);    
        }
        
        if (selectable && (typeof selectable !== 'boolean'))
        {
            error.wrongSelectableErrorMessage = CompileErrors.selectableError(selectable);
        }
        
        if (sortable && (typeof sortable !== 'boolean'))
        {
            error.wrongSortableErrorMessage = CompileErrors.sortableError(sortable);
        }
        
        if (Export && (Export != "csv" && Export != "json" && Export !== "true" && Export !== "false" && Export !== true && Export !== false))
        {
            error.wrongExportTypeErrorMessage = CompileErrors.wrongActionTypeError(Export);
        }
        
        if (SendEmail && (SendEmail != "csv" && SendEmail != "json" && SendEmail !== "true" && SendEmail != "false" && SendEmail !== true && SendEmail != false))
        {
            error.wrongSendEmailTypeErrorMessage = CompileErrors.wrongActionTypeError(SendEmail);
        }
        
        if (populate && (typeof populate !== 'string') && (Object.prototype.toString.call( populate ) != '[object Array]'))
        {
            error.wrongPopulateErrorMessage = CompileErrors.notStringError(populate);
        }
        else if(Object.prototype.toString.call( populate ) === '[object Array]' && populate[0])
        {
            var stop = false;
            for (var i = 0; !stop && i < populate.length; i++)
            {
               if(typeof populate[i] != "string")
               {
                   stop = true;
                   error.wrongPopulateErrorMessage = CompileErrors.notStringError(populate[i]);
               }
            }
        }
        if (height && (typeof height !== 'number'))
        {
            error.wrongHeightAttributeErrorMessage = CompileErrors.wrongImageAttributeError(height);
        }
        
        if (width && (typeof width !== 'number'))
        {
            error.wrongWidthAttributeErrorMessage = CompileErrors.wrongImageAttributeError(width);
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
    }
};