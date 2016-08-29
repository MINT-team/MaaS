syntax Cell = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let body = #``;
    
    // read itentity
    for(let item of params)
    {
        params.next();      // salta ':'
        if(item.val() == 'transformation')
        {
            identity = identity.concat(#`${item}: ${params.expand('FunctionExpression').value}`);
        }
        else
            identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    
    // read body
    ctxItem = ctx.next();
    if(ctxItem.done == false)
    {
        ctxItem = ctxItem.value;
        if(!ctxItem.isBraces())     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        params = ctxItem.inner();
        for (let item of params)
        {
            params.next();     // salta ':'
            body = body.concat(#`${item}: ${params.next('expr').value}`);
        }
    }
    tot = #`DSL.compileCell({${identity}}, {${body}}, callback)`;
    return tot;
}
syntax row = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    
    let tot = #``;
    let identity = #``;
    let dashboardRow = #``;
    let body = #``;
    
    // read itentity
    let params = ctxItem.inner();
    let marker = params.mark();
    for(let item of params)
    {
                
        if(item.isIdentifier('Collection') || item.isIdentifier('Document') || item.isIdentifier('Cell'))
        {
            params.reset(marker);
            let expr = params.expand('expr');
            marker = params.mark();
            let dslItem = #`${expr.value}`;
            
            if(dslItem._tail && dslItem._tail.array[0].type == "CallExpression")
            {
                let type = dslItem._tail.array[0].callee.property;
                let args = dslItem._tail.array[0].arguments._tail.array;
                if(type == "compileCell")
                {                    
                    dslItem =  #`{type: "Cell", identity: ${args[1]}, body: ${args[3]}}`;
                }
                if(type == "compileDocument")
                {
                    dslItem =  #`{type: "Document", identity: ${args[1]}, rows: ${args[3]}, action: ${args[5]}}`;
                    
                }
                if(type == "compileCollection")
                {
                    dslItem =  #`{type: "Collection", identity: ${args[1]}, columns: ${args[3]}, document: ${args[5]}, action: ${args[7]}}`;
                }
            }
            dashboardRow = dashboardRow.concat(#`${dslItem}`);
        }
        else if(item.isIdentifier('transformation'))
        {
            params.next();      // salta ':'
            let expr = params.expand('FunctionExpression');
            identity = identity.concat(#`${item}: ${expr.value}`);
            params.next(); // salta ','
            marker = params.mark();            
        } 
        else
        {
            params.next();      // salta ':'
            let expr = params.next();
            identity = identity.concat(#`${item}: ${expr.value}`);
            params.next(); // salta ','
            marker = params.mark();            
        }            
        /*
        params.next();      // salta ':'
        if(item.val() == 'transformation')
        {
            identity = identity.concat(#`${item}: ${params.expand('FunctionExpression').value}`);
        }
        else
            identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','*/
    }
    tot = #`{${identity}}`;
    if(dashboardRow != #``)
    {
        tot = #`[${dashboardRow}]`;
        //throw dashboardRow;
    }
    return tot;
}

syntax action = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let empty = true;   
        
    // read itentity
    for(let item of params)
    {      
        empty = false;
        params.next();      // salta ':'
        identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    if(empty)
        throw new Error("Action must define at least \"Export\" or \"SendEmail\"");
    tot = #`{${identity}}`;
    return tot;
}

syntax Document = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    let nested = false;
    let tot = #``;
    let identity = #``;
    let rows = #``;
    let action = #``;
    
    // read itentity
    for(let item of params)
    {
        params.next();      // salta ':'
        identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    
    // read body
    ctxItem = ctx.next();    
    let ctkMarker = ctx.mark();
    if(ctxItem.done == false)
    {
        let value = ctxItem.value;
        if(!value.isBraces() && (value.isParens() || value.isBrackets()))     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        else if(value.isBraces())
        {
            ctxItem = ctx.next();   // read braces in ctx
            params = value.inner();
            let marker = params.mark();
            let found = false;
            for(let item of params)
            {
                if(item.isIdentifier('row'))
                {
                    params.reset(marker);
                    let expr = params.expand('expr');
                    marker = params.mark();
                    rows = rows.concat(#`${expr.value}`);
                }
                else if(item.isIdentifier('action'))
                {
                    if(!found)
                    {
                        params.reset(marker);
                        let expr = params.expand('expr');
                        marker = params.mark();
                        action = action.concat(#`${expr.value}`);
                        found = true;
                    }
                    else
                        throw new Error('Multiple actions defined, action must be unique');
                }
                else
                {
                    throw new Error('Unexpected syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
                    //params.next();                
                }
            }
        }
    }
    if(!ctxItem.done)
        nested = true;
    ctx.reset(ctkMarker);   // reset ctx after body read
    
    if(action == #``)
        action = #`{}`;
        
    if(nested)
        tot = #`{type: "Document", identity: {${identity}}, rows: [${rows}], action: ${action}}`;
    else
        tot = #`DSL.compileDocument({${identity}}, [${rows}], ${action}, false, callback)`;
    return tot;
}

syntax Collection = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    let nested = false;
    let tot = #``;
    let identity = #``;
    let columns = #``;
    let action = #``;
    let document = #``;
    
    // read itentity
    for(let item of params)
    {
        params.next();      // salta ':'
        identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    
    // read body
    ctxItem = ctx.next();
    let ctkMarker = ctx.mark();
    if(ctxItem.done == false)
    {
        let value = ctxItem.value;
        if(!value.isBraces() && (value.isParens() || value.isBrackets()))     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        else if(value.isBraces())
        {
            ctxItem = ctx.next();   // read braces in ctx
            params = value.inner();
            let marker = params.mark();
            let found = false;
            for(let item of params)
            {            
                if(item.isIdentifier('column'))
                {
                    params.reset(marker);
                    let expr = params.expand('expr');
                    columns = columns.concat(#`${expr.value}`);
                    marker = params.mark();
                }
                else if(item.isIdentifier('Document'))
                {
                    params.reset(marker);
                    let expr = params.expand('expr');
                    document = document.concat(#`${expr.value}`);
                    marker = params.mark();
                }
                else if(item.isIdentifier('action'))
                {
                    if(!found)
                    {
                        params.reset(marker);
                        let expr = params.expand('expr');
                        action = action.concat(#`${expr.value}`);
                        marker = params.mark();
                        found = true;
                    }
                    else
                        throw new Error('Multiple actions defined, action must be unique');
                }
                else
                {
                    throw new Error('Unexpected syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);             
                }
            } 
        }
    }
    if(!ctxItem.done)
        nested = true;
    ctx.reset(ctkMarker);   // reset ctx after body read
       
    // check if document is formatted as a function call
    if(document._tail && document._tail.array[0].type == "CallExpression")
    {
        let args = document._tail.array[0].arguments._tail.array;
        let documentIdentity = args[1];        
        let documentRows = args[3];
        let documentAction = args[5];
        document =  #`{identity: ${documentIdentity}, rows: ${documentRows}, action: ${documentAction}}`;
    }
    
    if(document == #``)
        document = #`{}`;

    if(action == #``)
        action = #`{}`;
        
    if(nested)
        tot = #`{type: "Collection", identity: {${identity}}, columns: [${columns}], document: ${document}, action: ${action}}`;
    else
        tot = #`DSL.compileCollection({${identity}}, [${columns}], ${document}, ${action}, callback)`;
    
    return tot;
}

syntax column = function (ctx) { 
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let body = #``;
    
    // read itentity
    for(let item of params)
    {
        params.next();      // salta ':'
        if(item.val() == 'transformation')
        {
            identity = identity.concat(#`${item}: ${params.expand('FunctionExpression').value}`);
        }
        else
            identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    tot = #`{${identity}}`;
    return tot;
}

syntax Dashboard = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    let tot = #``;
    let identity = #``;
    let rows = #``;
    let action = #``;
    
    // read itentity
    for(let item of params)
    {
        params.next();      // salta ':'
        identity = identity.concat(#`${item}: ${params.next().value}`);
        params.next(); // salta ','
    }
    
    // read body
    ctxItem = ctx.next();
    if(ctxItem.done == false)
    {
        let value = ctxItem.value;
        if(!value.isBraces() && (value.isParens() || value.isBrackets()))     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        else if(value.isBraces())
        {
            params = value.inner();
            let marker = params.mark();
            let found = false;
            for(let item of params)
            {
                if(item.isIdentifier('row'))
                {
                    params.reset(marker);
                    let expr = params.expand('expr');
                    marker = params.mark();
                    rows = rows.concat(#`${expr.value}`);
                }
                else if(item.isIdentifier('action'))
                {
                    if(!found)
                    {
                        params.reset(marker);
                        let expr = params.expand('expr');
                        action = action.concat(#`${expr.value}`);
                        marker = params.mark();
                        found = true;
                    }
                    else
                        throw new Error('Multiple actions defined, action must be unique');
                }
                else
                {
                    throw new Error('Unexpected syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
                    //params.next();                
                }
            }
        }
    }
    
    if(action == #``)
        action = #`{}`;
        
    tot = #`DSL.compileDashboard({${identity}}, [${rows}], ${action}, callback)`;
    return tot;
}