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
        ctxItem = ctxItem.value;
        if(!ctxItem.isBraces())     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        params = ctxItem.inner();
        let items = ctxItem.inner();
        let found = false;
        for(let item of items)
        { 
            let expr = params.expand('expr');
            if(item.isIdentifier('row'))
            {
                rows = rows.concat(#`${expr.value}`);
                items.next();
            }
            else if(item.isIdentifier('action'))
            {
                if(!found)
                {
                    action = action.concat(#`${expr.value}`);
                    items.next();
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
        
        /*
        let expr = params.expand('expr');
        let item = items.next().value;
        while(expr && expr.done == false && item.isIdentifier("row"))
        {   
            body = body.concat(#`${expr.value}`);            
            expr = params.expand('expr');
            item = items.next().value;
            return #`${item}`;
        }
        */
    }
    if(action != #``)
        tot = #`DSL.compileDocument({${identity}}, [${rows}], ${action}, callback)`;
    else
        tot = #`DSL.compileDocument({${identity}}, [${rows}], {}, callback)`;
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

syntax Collection = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
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
    if(ctxItem.done == false)
    {
        ctxItem = ctxItem.value;
        if(!ctxItem.isBraces())     // check for braces
            throw new Error('Unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        params = ctxItem.inner();
        let items = ctxItem.inner();
        let found = false;
        let afterDocument = false;
        for(let item of items)
        {
            let expr = params.expand('expr');
            if(item.isIdentifier('column'))
            {
                columns = columns.concat(#`${expr.value}`);
                items.next();
            }
            else if(item.isIdentifier('Document'))
            {
                document = document.concat(#`${expr.value}`);
                items.next();
                afterDocument = true;
            }
            else if(item.isIdentifier('action'))
            {
                if(!found)
                {
                    action = action.concat(#`${expr.value}`);
                    items.next();
                    found = true;
                }
                else
                    throw new Error('Multiple actions defined, action must be unique');
            }
            else
            {
                if(afterDocument == true && item.isBraces())
                    items.next();
                else                
                    throw new Error('Unexpected syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);             
            }
        }        
    }
    if(action != #``)
        tot = #`DSL.compileCollection({${identity}}, [${columns}], ${document}, ${action}, callback)`;
    else
        tot = #`DSL.compileCollection({${identity}}, [${columns}], ${document}, {}, callback)`;
    return tot;
}