syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
}

syntax cell = function (ctx) {
    var ctxItem = ctx.next().value;
    if(!ctxItem.isParens())     // check for parens
        throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
    let parens = ctxItem.inner();
    var sortby;
    var type;
    var order;
    var query;
    var value;
    
    // read itentity
    for (let item of parens)
    {
        if(item.val() == 'sortby')
        {
            parens.next();      // prende ':'
            sortby = parens.expand('expr').value;
            
        }
        else if(item.val() == 'type')
        {
            parens.next();      // prende ':'
            type = parens.expand('expr').value;
        }
        else if(item.val() == 'order')
        {
            parens.next();      // prende ':'
            order = parens.expand('expr').value;
        }
        else if(item.val() == 'query')
        {
            parens.next();      // prende ':'
            query = parens.expand('expr').value;
        }
        else
        {
            throw new Error('unknown syntax: ' + #`${item}` + ' at: ' + #`${item.lineNumber()}`);
        }
        parens.next();      // prende ','
    }
    
    // read body
    ctxItem = ctx.next();
    if(ctxItem.done == false)
    {
        ctxItem = ctxItem.value;
        if(!ctxItem.isBraces())     // check for braces
            throw new Error('unexpected syntax: ' + #`${ctxItem}` + ' at: ' + #`${ctxItem.lineNumber()}`);
        let braces = ctxItem.inner();
        for (let item of braces)
        {
            if(item.val() == "value")
            {
                braces.next();
                value = braces.expand('expr').value;
            }
            else
            {
                throw new Error('unknown syntax: ' + #`${item}`);
            }
        }
    }
    
    // return the object
    let dummy = #`dummy`.get(0);
    let dsl = #`DSL`;
    var identity = #``;
    if(sortby)
        identity = identity.concat(#`sortby: ${sortby}_,_`);
    if(type)
        identity = identity.concat(#`type: ${type}_,_`);
    if(order)
        identity = identity.concat(#`order: ${order}_,_`);
    if(query)
        identity = identity.concat(#`query: ${query}`);
        
    var body = #``;
    if(value)
        body = body.concat(#`value: ${value}`);
        
    var res = #`identity: {${identity}}_,_ body: {${body}}`;
    return res;
}



// -> sortby: "surname"


//     cell(	// primo valore della query
//     	    sortby: “surname”,
//         order: “asc”,
//         query: {age: {$lt: 40}},
//         type: “string”
//     ){
//     	value: ””	// opzionale
//     }


// dashboard(
//     	row(
//     		collection()
//     		document()
//     		cell()
//     	)
//     	row(
//     		cell()
//     	)
//     ){
//     	name: “nome_dashboard”
//     }
    
    
//     collection(
//         name: “customers”,
//         label: “JuniorCustomers”,
//         id: “Junior”,
//         weight:”0”
//     ) {
//         index(
//     		perpage: “20”,
//     		sortby: “surname”,
//     		order: “asc”,
//     		query: {age: {$lt: 40}}
//     	) {
//     		column(
//     	        name: “name”,
//             	label: “Nome”,
//             	sortable: false,
//             	selectable: false
//             	transformation: function(val) {
//                     return val.lenght;
//             	}
//             )
//     		column()
//         }
    
//         action() {
//         	export: “true”,
//         	sendEmail: “true”
//         }
    
//         document() {
//             row(
//             	name: “name”,
//             	label: “Nome”,
//             	//trasformation: 
//             	//populate
//             )
//             row(
//         	    ...
//             )
//         }
//     }
    
    
//     document(
//     	name: “name”,	// collection mongoDB
//     	query: { 		// viene visualizzato solo il primo valore della query
//             age: {$lt: 40}
//             city: {$eq: “Laredo”}
//         },
//         order: “asc”
//     ) {
//     	row(
//             name: “name”,
//             label: “Nome”,
//             transformation: 
//     	)
//     	row(
    
//     	)
//     }
    
    
//     cell(	// primo valore della query
//     	    sortby: “surname”,
//         order: “asc”,
//         query: {age: {$lt: 40}},
//         type: “string”
//     ){
//     	value: ””	// opzionale
//     }

    
    
    