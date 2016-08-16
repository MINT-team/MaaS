syntax Cell = function (ctx) {
    let ctxItem = ctx.next().value;
    if (!ctxItem.isParens()) // check for parens
        throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let params = ctxItem.inner();
    
    let tot = #``;
    let identity = #``;
    let body = #``;
    
    let name = false;
    let label = false;
    let table = false;
    let sortby = false;
    let type = false;
    let order = false;
    let query = false;
    let trasformation = false;
    let columnLabel = false;
    
    // read itentity
    for(let item of params)
    {
        if( (item.val() == 'sortby' && sortby == false) ||
            (item.val() == 'type' && type == false) || 
            (item.val() == 'order' && order == false) || 
            (item.val() == 'query' && query == false) ||
            (item.val() == 'name' && name == false) ||
            (item.val() == 'label' && label == false) ||
            (item.val() == 'table' && table == false) ||
            (item.val() == 'trasformation' && trasformation == false) ||
            (item.val() == 'columnLabel' && columnLabel == false)
            )
        {
            if(item.val() == 'sortby')
                sortby = true;
            else if(item.val() == 'type')
                type = true;
            else if(item.val() == 'order')
                order = true;
            else if(item.val() == 'query')
                query = true;
            else if (item.val() == 'name')
                name = true;
            else if (item.val() == 'label')
                label = true;
            else if (item.val() == 'columnLabel')
                columnLabel = true;
            else if (item.val() == 'trasformation')
                trasformation = true;
            else if (item.val() == 'table')
                table = true;
                
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
    tot = #`DSL.executeCell({${identity}}, {${body}}, conn, cb)`;
    return tot;
}
