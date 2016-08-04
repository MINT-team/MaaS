// Name: {roles.js}
// Module: {Back-end}
// Location: {/MaaS/server/boot/}

// History:
// Version         Date            Programmer
// 1.0.0        26/07/2016      Fabiano Tavallini
// ==========================================

module.exports = function(app) {
    var Role = app.models.Role;
    //var RoleMapping = app.models.RoleMapping;
    
    Role.registerResolver('Owner', function(role, context, cb) {
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        // If the target model is not Company or user
        if(context.modelName !== 'Company' && context.modelName !== 'user' && context.modelName !== 'DSL') 
        {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        //console.log("> userId:", userId);
        if(!userId) 
        {
            return reject();
        }
        if(context.modelName == "user") 
        {
            context.model.findById(userId, function(err, user) {
                if(err || !user)
                    return reject();
                var Company = app.models.Company;
                Company.count({
                    ownerId: userId,
                    id: user.companyId
                }, function(err, count) {
                    if(err) 
                        return reject();
                    cb(null, count > 0); // true = is a company Owner
                });
            });
        }
        if(context.modelName == "Company") 
        {
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                
                if(company.ownerId == userId)
                    cb(null, true); // true = is a company Owner
                else
                    return reject();
            });
        }
        if(context.modelName == "DSL") 
        {
            // Creating a new DSL definition
            if(context.remotingContext.req.url == '/saveDefinition') 
            {
                var user = app.models.user;
                user.findById(userId, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == "Owner")
                        cb(null, true); // true = user is Owner so he can create DSL definition
                    else
                        return reject();    
                });
            // Existing DSL definition
            }
            else
            {
                context.model.findById(context.modelId, function(err, DSL) {
                    if(err || !DSL)
                        return reject();
                    DSL.users.findById(userId, function(err, user) {
                        if(err || !user)
                            return reject();
                        if(user.role == "Owner")
                            cb(null, true); // true = user is Owner and own this DSL definition
                        else
                            return reject();
                    });
                    
                });
            }
        }
    });
    
    Role.registerResolver('Administrator', function(role, context, cb) {
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        // If the target model is not Company or user
        if(context.modelName !== 'Company' && context.modelName !== 'user' && context.modelName !== 'DSL') {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        if(!userId) {
            return reject();
        }
        if(context.modelName == "user") 
        {
            context.model.findById(userId, function(err, user) {
                if(err || !user)
                    return reject();
                var Company = app.models.Company;
                Company.findOne({where: {id: user.companyId}, limit: 1}, function(err, companyInstance) {
                    if(err || !companyInstance)
                        return reject();
                    if(user.role == 'Administrator')
                        cb(null, true); // true = is a company Administrator
                    else
                        cb(null, false);
                });
            });
        }
        if(context.modelName == "Company") 
        {
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                var user = app.models.user;
                user.findOne({where: {id: userId, companyId: company.id}, limit: 1}, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == 'Administrator')
                        cb(null, true); // true = is a company Administrator
                    else
                        cb(null, false);
                });
            });   
        }
        if(context.modelName == "DSL") {
            // Creating a new DSL definition
            if(context.remotingContext.req.url == '/saveDefinition') 
            {
                var user = app.models.user;
                user.findById(userId, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == "Administrator")
                        cb(null, true); // true = user is Administrator so he can create DSL definition
                    else
                        return reject();    
                });
            // Existing DSL definition
            }
            else
            {
                context.model.findById(context.modelId, function(err, DSL) {
                    if(err || !DSL)
                        return reject();
                    DSL.users.findById(userId, function(err, user) {
                        if(err || !user)
                            return reject();
                        if(user.role == "Administrator")
                            cb(null, true); // true = user is Administrator and own this DSL definition
                        else
                            return reject();
                    });
                    
                });
            }
        }
    });
    
    Role.registerResolver('Member', function(role, context, cb) {
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        // If the target model is not Company or user
        if(context.modelName !== 'Company' && context.modelName !== 'user' && context.modelName !== 'DSL') 
        {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        if(!userId) 
        {
            return reject();
        }
        if(context.modelName == "user") 
        {
            context.model.findById(userId, function(err, user) {
                if(err || !user)
                    return reject();
                var Company = app.models.Company;
                Company.findOne({where: {id: user.companyId}, limit: 1}, function(err, companyInstance) {
                    if(err || !companyInstance)
                        return reject();
                    if(user.role == 'Member')
                        cb(null, true); // true = is a company Member
                    else
                        cb(null, false);
                });
            });
        }
        if(context.modelName == "Company") 
        {
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                var user = app.models.user;
                user.findOne({where: {id: userId, companyId: company.id}, limit: 1}, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == 'Member')
                        cb(null, true); // true = is a company Member
                    else
                        cb(null, false);
                });
            });   
        }
        if(context.modelName == "DSL") 
        {
            // Creating a new DSL definition
            if(context.remotingContext.req.url == '/saveDefinition') {
                var user = app.models.user;
                user.findById(userId, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == "Member")
                        cb(null, true); // true = user is Member so he can create DSL definition
                    else
                        return reject();    
                });
            // Existing DSL definition
            }
            else
            {
                context.model.findById(context.modelId, function(err, DSL) {
                    if(err || !DSL)
                        return reject();
                    DSL.users.findById(userId, function(err, user) {
                        if(err || !user)
                            return reject();
                        if(user.role == "Member")
                            cb(null, true); // true = user is Member and own this DSL definition
                        else
                            return reject();
                    });
                    
                });
            }
        }
    });
    
    Role.registerResolver('Guest', function(role, context, cb) {
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        // If the target model is not Company or user
        if(context.modelName !== 'Company' && context.modelName !== 'user') {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        if(!userId) {
            return reject();
        }
        if(context.modelName == "user") {
            context.model.findById(userId, function(err, user) {
                if(err || !user)
                    return reject();
                var Company = app.models.Company;
                Company.findOne({where: {id: user.companyId}, limit: 1}, function(err, companyInstance) {
                    if(err || !companyInstance)
                        return reject();
                    if(user.role == 'Guest')
                        cb(null, true); // true = is a company Guest
                    else
                        cb(null, false);
                });
            });
        }
        if(context.modelName == "Company") {
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                var user = app.models.user;
                user.findOne({where: {id: userId, companyId: company.id}, limit: 1}, function(err, userInstance) {
                    if(err || !userInstance)
                        return reject();
                    if(userInstance.role == 'Guest')
                        cb(null, true); // true = is a company Guest
                    else
                        cb(null, false);
                });
            });   
        }
    });
    
    Role.registerResolver('SuperAdmin', function(role, context, cb) {
        function reject() {
            process.nextTick(function() {
                cb(null, false);
            });
        }
        // If the target model is not Company or user
        if(context.modelName !== 'Company' && context.modelName !== 'user') {
            return reject();
        }
        // Do not allow anonymous users
        var userId = context.accessToken.userId;
        if(!userId) {
            return reject();
        }
        var SuperAdmin = app.models.SuperAdmin;
        SuperAdmin.findById(userId, function(err, superAdmin) {
            if(err || !superAdmin)
                return reject();
            if(superAdmin)
                cb(null, true); // true = is a super admin
            else
                cb(null, false);
        });
    });
};