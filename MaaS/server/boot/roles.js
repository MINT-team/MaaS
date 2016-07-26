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
                    cb(null, count > 0); // true = is a company Owner
                });
            });
        }
        if(context.modelName == "Company") {
            context.model.findById(context.modelId, function(err, company) {
                if(err || !company)
                    return reject();
                
                if(company.ownerId == userId) {
                    cb(null, true); // true = is a company Owner
                } else {
                    return reject();
                }
            });
        }
    });
    
    Role.registerResolver('Administrator', function(role, context, cb) {
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
                    if(err || !companyInstance) {
                        console.log(err);
                        return cb(null, false);
                    }
                    if(user.role == 'Administrator') {
                        cb(null, true); // true = is a company Administrator
                    } else {
                        cb(null, false);
                    }
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
                    if(userInstance.role == 'Administrator') {
                        cb(null, true); // true = is a company Administrator
                    } else {
                        cb(null, false);
                    }
                });
            });   
        }
    });
    
    Role.registerResolver('Member', function(role, context, cb) {
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
                    if(err || !companyInstance) {
                        console.log(err);
                        return cb(null, false);
                    }
                    if(user.role == 'Member') {
                        cb(null, true); // true = is a company Member
                    } else {
                        cb(null, false);
                    }
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
                    if(userInstance.role == 'Member') {
                        cb(null, true); // true = is a company Member
                    } else {
                        cb(null, false);
                    }
                });
            });   
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
                    if(err || !companyInstance) {
                        console.log(err);
                        return cb(null, false);
                    }
                    if(user.role == 'Guest') {
                        cb(null, true); // true = is a company Guest
                    } else {
                        cb(null, false);
                    }
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
                    if(userInstance.role == 'Guest') {
                        cb(null, true); // true = is a company Guest
                    } else {
                        cb(null, false);
                    }
                });
            });   
        }
    });
};