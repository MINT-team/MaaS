module.exports = {
    readOptionalAttributes: function(source, optional) {
        var result = {};
        for (var i=0; i<optional.length; i++)
        {
    		var attr = optional[i];
    
    		if (source[attr] !== undefined)
    		{
    			result[attr] = source[attr];
    			//delete source[attr];
    			continue;
    		}
	    }
    },
    
    readRequiredAttributes: function(source, required, errback) {
        var missingAttributes = [];
        var result = {};
        for(var i = 0; i < required.length; i++)
        {
		    var attr = required[i];
		    
			//var keys = Object.keys(identity);
			
		    if(source[attr] !== undefined)
		    {
			    result[attr] = source[attr];
			    //delete source[attr];
			    continue;
	    	}
	    	missingAttributes.push(attr);
	    }
	    // Attributi mancanti
	    if (missingAttributes.length > 0)
	    {
		    return errback(missingAttributes);
	    }
	    else
	    {
	        return result;
	    }
    }
};