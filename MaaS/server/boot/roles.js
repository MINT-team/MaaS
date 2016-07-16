module.exports = function(app) {
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;


    // DYNAMIC ROLES

    // Role.registerResolver('companyMember', function(role, context, cb) {
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

    //         if(company.id ==
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