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
        let expr = params.expand('expr');
        while(expr && expr.done == false)
        {
            body = body.concat(#`${expr.value}`);
            expr = params.expand('expr');
        }        
    }
    tot = #`DSL.compileDocument({${identity}}, [${body}], callback)`;
    return tot;
}