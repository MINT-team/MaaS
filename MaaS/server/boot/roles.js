// Name: {roles.js}
// Module: {Back-end}
// Location: {/MaaS/server/boot/}

// History:
// Version         Date            Programmer
// ==========================================

module.exports = function(app) {
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;


    // DYNAMIC ROLES
    
    Role.registerResolver('Owner', function(role, context, cb) {
        //console.log("> property: ", context.property);
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        
        //console.log("> modelName: ", context.modelName);
        // If the target model is not Company
        if(context.modelName !== 'Company' && context.modelName !== 'user') {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        //console.log("> userId:", userId);
        if(!userId) {
            return reject();
        }
        
        if(context.modelName == "user") {
            // Check if userId is in user table for the given project id
            context.model.findById(userId, function(err, user) {
                if(err || !user)
                    return reject();
                var Company = app.models.Company;
                Company.count({
                    ownerId: userId,
                    id: user.companyId
                }, function(err, count) {
                    if(err) {
                        console.log(err);
                        return cb(null, false);
                    }
                    
                    //console.log("> user is company Owner: ", count > 0);
                    cb(null, count > 0); // true = is a company Owner
                });
            });
        }

        if(context.modelName == "Company") {
            // Check if userId is in company table for the given project id
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                
                if(company.ownerId == userId) {
                    console.log("> owner of: ", company.name);
                    cb(null, true); // true = is a company Owner
                } else {
                    return reject();
                }
            });
        }
    });
    
    // Role.registerResolver('Administrator', function(role, context, cb) {
    //     function reject() {
    //         process.nextTick(function() {
    //             cb(null, false);
    //         });
    //     }
    //     // If the target model is not Company
    //     if(context.modelName !== 'Company') {
    //         return reject();
    //     }

    //     // Do not allow anonymous users
    //     var userId = context.accessToken.userId;
    //     if(!userId) {
    //         return reject();
    //     }

    //     // Check if userId is in company table for the given project id
    //     context.model.findById(context.modelId, function(err, company) {
    //         if(err || !company)
    //             return reject();
                
    //         var user = app.models.user;
    //         user.findOne({where: {id: userId}, limit: 1}, function(err, userIstance) {
    //             if(company.id == userIstance.companyId) {
    //                 cb(null, true); // true = is a company Administrator
    //             } else {
    //                 return reject();
    //             }
    //         });
    //     });
    // });
    
    // Role.registerResolver('Member', function(role, context, cb) {
    //     function reject() {
    //         process.nextTick(function() {
    //             cb(null, false);
    //         });
    //     }
    //     // If the target model is not Company
    //     if(context.modelName !== 'Company') {
    //         return reject();
    //     }

    //     // Do not allow anonymous users
    //     var userId = context.accessToken.userId;
    //     if(!userId) {
    //         return reject();
    //     }

    //     // Check if userId is in company table for the given project id
    //     context.model.findById(context.modelId, function(err, company) {
    //         if(err || !company)
    //             return reject();

    //         var user = app.models.user;
    //         user.findOne(
                
    //         if(company.id == 
    //         );
    //         var Company = app.models.Company;
    //         Company.count({
    //             ownerId: company.ownerId,
    //             memberId: userId
    //         }, function(err, count) {
    //             if (err) {
    //                 console.log(err);
    //                 return cb(null, false);
    //             }

    //             cb(null, count > 0); // true = is a company member
    //         });
    //     });
    // });
};