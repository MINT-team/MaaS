syntax Cell = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let body = #``;
    
    let sortby;
    let type;
    let order;
    let query;
    let value;
    
    // read itentity
    for(let item of params)
    {
        if(item.val() == 'sortby' || item.val() == 'type' || item.val() == 'order' || item.val() == 'query')
        {
            
            params.next();      // salta ':'
            identity = identity.concat(#`${item}: ${params.next('expr').value}`);
            params.next(); // salta ','
        }
        else
        {
            throw new Error('unknown syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
        }
    }
    
    // read body
    ctxItem = ctx.next();
    if(ctxItem.done == false)
    {
        ctxItem = ctxItem.value;
        if(!ctxItem.isBraces())     // check for braces
            throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        params = ctxItem.inner();
        for (let item of params)
        {
            if(item.val() == "value")
            {
                params.next();     // salta ':'
                body = body.concat(#`${item}: ${params.next('expr').value}`);
            }
            else
            {
                throw new Error('unknown syntax: ' + #`${item}`);
            }
        }
    }
    
    tot = #`DSL.executeCell({${identity}}, {${body}})`;
    return tot;
}