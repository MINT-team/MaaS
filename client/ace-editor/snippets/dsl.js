ace.define("ace/snippets/dsl",["require","exports","module"], function(require, exports, module) {
    "use strict";
    
    exports.snippetText = "# Cell\n\
snippet Cell\n\
	Cell (\n\
	    type: ${1}\n\
	) {\n\
		value: ${2}\n\
	}\n\
# Document\n\
snippet Document\n\
	Document (\n\
	    table: ${1}\n\
	    query: {${2}}\n\
	) {\n\
	    \n\
	}\n\
# Collection\n\
snippet Collection\n\
	Collection (\n\
	    table: ${1}\n\
	    query: {${2}}\n\
	) {\n\
	    \n\
	}\n\
# Dashboard\n\
snippet Dashboard\n\
	Dashboard (\n\
	    label: ${1}\n\
	) {\n\
	    \n\
	}\n\
# Action\n\
snippet action\n\
	action (\n\
	    Export: ${1}\n\
	    SendEmail: ${2}\n\
	)\n\
# Row\n\
snippet row\n\
	row (\n\
	    name: ${1}\n\
	    type: ${2}\n\
	)\n\
# Column\n\
snippet column\n\
	column (\n\
	    name: ${1}\n\
	    type: ${2}\n\
	)\n\
# Image\n\
snippet image\n\
	image (\n\
	    width: ${1}\n\
	    height: ${2}\n\
	)\n\
# Link\n\
snippet link\n\
	link (\n\
	    label: ${1}\n\
	)\n\
# Transformation\n\
snippet transformation\n\
	transformation: function(val) {\n\
	    return val + \"${1}\"\n\
	}\n\
";
	exports.scope = "dsl";
});