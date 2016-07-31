// Name: {super-admin.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

module.exports = function(Superadmin) {
    
    Superadmin.afterRemote('login', function(ctx, remoteMethodOutput, next) {
        console.log(">afterRemote SUPER");
        var ctx_ttl = ctx.result.ttl ;
        var ctx_userId = ctx.result.userId ;
        var ctx_created = ctx.result.created ;
        var ctx_id = ctx.result.id ;
        var ctx_type = "superAdmin";
        
        ctx.result = {
                ttl: ctx_ttl,
                userId: ctx_userId,
                created :ctx_created,
                id: ctx_id,
                type: ctx_type
            };
            
        next();
    });
};
