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

syntax Document = function (ctx) {
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
        for(let item of items)
        {            
            if(item.isIdentifier('row'))
            {
                let expr = params.expand('expr');
                body = body.concat(#`${expr.value}`);
                items.next();
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
    tot = #`DSL.compileDocument({${identity}}, [${body}], callback)`;
    return tot;
}