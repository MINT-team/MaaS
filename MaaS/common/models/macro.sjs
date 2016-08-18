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
        identity = identity.concat(#`${item}: ${params.next('expr').value}`);
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
