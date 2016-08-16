syntax Cell = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let body = #``;
    
    let sortby = false;
    let type = false;
    let order = false;
    let query = false;
    
    // read itentity
    for(let item of params)
    {
        if( (item.val() == 'sortby' && sortby == false) ||
            (item.val() == 'type' && type == false) || 
            (item.val() == 'order' && order == false) || 
            (item.val() == 'query' && query == false) )
        {
            if(item.val() == 'sortby')
                sortby = true;
            else if(item.val() == 'type')
                type = true;
            else if(item.val() == 'order')
                order = true;
            else if(item.val() == 'query')
                query = true;
                
            params.next();      // salta ':'
            identity = identity.concat(#`${item}: ${params.next('expr').value}`);
            params.next(); // salta ','
        }
        else
        {
            if(item.val() != 'sortby' && item.val() != 'type' && item.val() != 'order' && item.val() != 'query')
                throw new Error('Unknown syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
            else
                throw new Error('Keyword already defined: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
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
            if(item.val() == 'value')
            {
                params.next();     // salta ':'
                body = body.concat(#`${item}: ${params.next('expr').value}`);
            }
            else
            {
                throw new Error('Unknown syntax: ' + #`${item}`);
            }
        }
    }
    tot = #`DSL.executeCell({${identity}}, {${body}})`;
    return tot;
}