// Name: {user.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

var loopback = require('loopback');
var config = require('../../server/config.json');
var app = require('../../server/server.js');
var path = require('path');
var host = 'maas-navid94.c9users.io';
var port = '8080';

var MIN_PASSWORD_LENGTH = 8;
var INVITATION_TTL = 1209600; // 2 weeks in seconds

module.exports = function(user) {

    // Registrazione proprietario - controllo credenziali
    user.signUp = function(company, email, password, confirmation, cb) {
        if(!password || !confirmation) {
            var error = { message: 'Insert the password and its confirmation' };
            return cb(null, error);   // callback di insuccesso
        }
        if(password != confirmation) {
            error = { message: 'Password confirmation doesn\'t match' };
            return cb(null, error);   // callback di insuccesso
        }
        if(password.length < MIN_PASSWORD_LENGTH) {
            error = { message: 'Password is too short, the minumum lenght is ' + MIN_PASSWORD_LENGTH + ' characters' };
            return cb(null, error);   // callback di insuccesso
        }
        // Search for an already existing company
        var Company = app.models.Company;
        Company.findOne({where: {name: company}, limit: 1}, function(err, existingCompany) {
            if(err) return cb(null, err);
            if(!err && existingCompany) {
                console.log('> company already exists:', existingCompany);
                error = { message: 'A company with this name already exists' };
                return cb(null, error);   // callback di insuccesso
            }
            // If company does not exists search for an already existing user
            user.findOne({where: {email: email}, limit: 1}, function(err, existingUser) {
                if(err) return cb(null, err);
                if(!err && existingUser) {
                    console.log('> user already exists:', existingUser);
                    error = {
                        message: 'A user with this email already exists'
                    };
                    return cb(null, error);   // callback di insuccesso
                }
                // Create the company
                Company.create({name: company}, function(err, companyInstance) {
                    if(err) return cb(null, err);
                    console.log('> company created:', companyInstance);
                    // Create the user and set the company has him
                    user.create({companyId: companyInstance.id, email: email, password: password, role: "Owner"}, function(err, userInstance) {
                        if(err) {
                            Company.destroyById(companyInstance.id, function(err) {
                                if(err) {
                                    console.log("> error destroying the company after an error occurred creating the user. Please clean your database, company id:", companyInstance.id);
                                    return cb(null, err);
                                }
                            });
                            console.log("> error creating the user, company destroyed");
                            return cb(null, err);
                        }
                        console.log('> user created:', userInstance);
                        userInstance.company(companyInstance);  // Set that user created belongs to the company
                        companyInstance.owner(userInstance);    // Set the user is the owner of the company, dynamic role $owner
                        // Save relations in the database
                        userInstance.save();
                        companyInstance.save();
                        // Send verification email after registration
                        var options = {
                            type: 'email',
                            host: host,
                            to: userInstance.email,
                            from: 'noreply@maas.com',
                            subject: 'Welcome to MaaS',
                            text: 'Please click on the link below to verify your email address and complete your registration:',
                            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
                            redirect: '/%23/login', // percent encoding => /#/login
                            user: userInstance
                        };
                        userInstance.verify(options, function(err, response) {
                            if(err) {
                                //return next(err);
                                return cb(null, err);
                            }
                            console.log('> verification email sent:', response);
                        });
                        // Returns data to the client
                        return cb(null, null, userInstance.email, companyInstance.name);   // callback di successo
                    });
                });
            });
        });
    };

    user.remoteMethod(
        'signUp',
        {
            description: 'Register a owner user and create his company.',
            accepts: [
                { arg: 'company', type: 'string', required: true, description: 'Company name'},
                { arg: 'email', type: 'string', required: true, description: 'User email'},
                { arg: 'password', type: 'string', required: true, description: 'Password'},
                { arg: 'confirmation', type: 'string', required: true, description: 'Password confirmation'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'email', type: 'string'},
                {arg: 'company', type: 'string'}
            ],
            http: { verb: 'post', path: '/signUp' }
        }
    );

    // Controllo i dati di registrazione prima della creazione
    /*user.beforeRemote('create', function(context, member, next) {
        if(!context.req.password || !context.req.confirmation) {
            var error = {
                message: 'Insert the password and its confirmation'
            };
            //return cb(null, error);   // callback di insuccesso
            //next(error);
        }
        if(context.req.password != context.req.confirmation) {
            error = {
                message: 'Password confirmation doesn\'t match'
            };
            //return cb(null, error);   // callback di insuccesso
            //next(error);
        }
        var Company = app.models.Company;   // working with loopback objects
        // search for an already existing company
        Company.findOne({where: {name: context.req.company}, limit: 1}, function(err, existingCompany) {
            if(err) {
                //return cb(null, err);
                //next(err);
            }
            if(!err && existingCompany) {
                console.log('> company already exists:', existingCompany);
                error = {
                    message: 'Company already exists'
                };
                //return cb(null, error);   // callback di insuccesso
                //next(error);
            }
            var newContext = {
                email: context.req.email,
                password: context.req.password
            }
            next(newContext);   // Quando creo la company?
        });
    });*/


    // Send verification email after registration
    /*user.afterRemote('create', function(context, user, next) {

        var options = {
            type: 'email',
            host: host,
            to: user.email,
            from: 'noreply@maas.com',
            subject: 'Welcome to MaaS',
            text: 'Please click on the link below to verify your email address and complete your registration:',
            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
            redirect: '/%23/login', // percent encoding => /#/login
            user: user
        };

        user.verify(options, function(err, response) {
            if(err) {
                return next(err);
            }
            console.log('> verification email sent:', response);
        });
        next();
    });*/

    // Send password reset link when requested
    user.on('resetPasswordRequest', function(info) {
        var url = 'http://' + host + ':' + port + '/';    // da cambiare con: config.host config.port
        var template = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
        var options = {
            resetHref: '' + url + '#/recoverpwd?uid=' + info.user.id + '&access_token=' + info.accessToken.id + ''
        };
        //var html = 'Click <a href="' + url + '?access_token=' + info.accessToken.id + '">here</a> to reset your password';
        var html = template(options);

        user.app.models.Email.send({
            to: info.email,
            from: 'noreply@maas.com',
            subject: 'Password reset',
            html: html
        }, function(err) {
            if (err) {
                return console.log('> error sending password reset email');
            }
            console.log('> sending password reset email to:', info.email);
        });
    });

    // Send invitation link when requested
    user.invite = function(info, cb) {
        // Check if company exists
        app.models.Company.findOne({where: {name: info.company}, limit: 1}, function(err, companyInstance) {
            if(err) return cb(err);
            // Initialize user account
            user.create({email: info.email, password: ' ', role: info.role, companyId: companyInstance.id}, function(err, userInstance) {
                if(err) return cb(err);
                // Create a verification token to confirm the user
                user.generateVerificationToken(userInstance, function(err, token) {
                    if (err) { return cb(err); }
                    userInstance.verificationToken = token;
                    userInstance.save(function(err) {
                        if(err) { return cb(err); }
                    });
                    // Create another token to set a new password after confirmation
                    userInstance.accessTokens.create({ ttl: INVITATION_TTL }, function(err, accessToken) {
                        if (err) { return cb(err); }
                        var url = 'http://' + host + ':' + port + '/api/users/confirm';    // da cambiare con: config.host config.port
                        var template = loopback.template(path.resolve(__dirname, '../../server/views/invite.ejs'));
                        var options = {
                            sender: info.sender,
                            role: info.role,
                            company: info.company,
                            inviteHref: '' + url + '?uid=' + userInstance.id
                            + '&redirect=/%23/register%3Fuid=' + userInstance.id + '%26access_token=' + accessToken.id
                            + '&token=' + userInstance.verificationToken + ''
                        };
                        var html = template(options);

                        user.app.models.Email.send({
                            to: info.email,
                            from: 'noreply@maas.com',
                            subject: 'Invitation to MaaS',
                            html: html
                        }, function(err) {
                            if (err) {
                                return console.log('> error sending invitation email');
                            }
                            console.log('> sending invitation email to:', info.email);
                            return cb(null);
                        });
                    });
                });
            });
        });
    };

    user.remoteMethod(
        'invite',
        {
            description: 'Invite a new user to the company.',
            accepts: [
                { arg: 'info', type: 'Object', required: true, description: 'Sender, company, role, email'},
            ],
            returns: [
                {arg: 'error', type: 'Object'}
            ],
            http: { verb: 'post', path: '/invite' }
        }
    );

    // Get editor configurations
    user.getEditorConfig = function(id, cb) {
        user.findById(id, function(err, user) {
            if (err)
                return cb(err);
            return cb(null,user.editorConfig);
        });
    };

    user.remoteMethod(
        'getEditorConfig',
        {
            description: 'Get editor configurations of the user.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id'},
            ],
            returns: [
                {arg: 'config', type: 'Object'}
            ],
            http: { verb: 'get', path: '/:id/editorConfig' }
        }
    );

    // Cambio password dopo l'email di verifica - vedesi relativo ACL
    user.changePassword = function(id, password, confirmation, cb) {
        user.findById(id, function(err, user) {
            if(err)
                return cb(err);
            if(!password || !confirmation) {
                var error = {
                    message: 'Insert the new password and its confirmation'
                };
                return cb(null, error);   // callback di insuccesso
            }
            if(password != confirmation) {
                error = {
                    message: 'Password confirmation doesn\'t match'
                };
                return cb(null, error);   // callback di insuccesso
            }
            if(password.length < MIN_PASSWORD_LENGTH) {
                error = {
                    message: 'Password is too short, the minumum lenght is ' + MIN_PASSWORD_LENGTH + ' characters'
                };
                return cb(null, error);   // callback di insuccesso
            }
            user.updateAttribute('password', password, function(err, user) {
                if(err) {
                    console.log('> failed resetting password for: ', user.email);
                    return cb(err);
                }
                console.log('> password reset processed successfully for: ', user.email);
                return cb(null, null, user.email);   // callback di successo
            });
        });
    };

    user.remoteMethod(
        'changePassword',
        {
            description: 'Reset a user password from email verification.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id'},
                { arg: 'password', type: 'string', required: true, description: 'New password'},
                { arg: 'confirmation', type: 'string', required: true, description: 'Password confirmation'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'email', type: 'string'}
            ],
            http: { verb: 'post', path: '/:id/changePassword' }
        }
    );

    // Cambio i dati anagrafici - vedesi relativo ACL
    user.changePersonalData = function(id, name, surname, dateOfBirth, gender, cb) {
        user.findById(id, function(err, user) {
            if(err)
                return cb(err);
            if(name || surname || dateOfBirth.valueOf() || gender) 
            {
                if(name) 
                {
                    user.updateAttributes({ name: name }, function() {
                        if(err) 
                        {
                            console.log('> failed changing name for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                if(surname) 
                {
                    user.updateAttributes({ surname: surname }, function() {
                        if(err) 
                        {
                            console.log('> failed changing surname for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                if(!dateOfBirth.valueOf()) 
                {
                    user.unsetAttribute("dateOfBirth");
                    user.save();
                } 
                else 
                {
                    user.updateAttributes({ dateOfBirth: dateOfBirth}, function() {
                        if(err) 
                        {
                            console.log('> failed changing date of birth for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                if(gender) 
                {
                    user.updateAttributes({ gender: gender }, function() {
                        if(err) 
                        {
                            console.log('> failed changing gender for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                var newData = {
                    name: name,
                    surname: surname,
                    dateOfBirth: dateOfBirth.valueOf() ? dateOfBirth : undefined,
                    gender: gender
                };
                console.log('> personal data changed successfully for: ', user.email);
                return cb(null, null, newData);   // callback di successo
            } 
            else 
            {
                console.log('> no data to change for: ', user.email);
                var error = {
                    message: 'No data to change'
                };
                return cb(null, error);
            }
        });

    };

    user.remoteMethod(
        'changePersonalData',
        {
            description: 'Change user attributes by passing id.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id'},
                { arg: 'name', type: 'string', required: false, description: 'New name'},
                { arg: 'surname', type: 'string', required: false, description: 'New surname'},
                { arg: 'dateOfBirth', type: 'date', required: false, description: 'New date of birth'},
                { arg: 'gender', type: 'string', required: false, description: 'New gender'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'newData', type: 'Object'}
            ],
            http: { verb: 'post', path: '/:id/changePersonalData' }
        }
    );

    // Elimino l'utente - vedesi relativo ACL
    user.deleteUser = function(id, email, cb) {
        user.findById(id, function(err, userInstance) {
            if(err || !userInstance)
                return cb(err);
            user.findOne({where: {companyId: userInstance.companyId, email: email}, limit: 1}, function(err, userToDelete) {
                if(err || !userToDelete)
                    return cb(err);
                if(userInstance.id != userToDelete.id) {
                    var error = {
                        message: 'You haven\'t the rights to delete this user'
                    };
                    if(userInstance.role != "Owner" && userInstance.role != "Administrator") {
                        return cb(null, error);
                    }
                    // if userInstance.role == "Owner" then he's allowed to
                    if(userInstance.role == "Administrator") {
                        if(userToDelete.role == "Owner" || userToDelete.role == "Administrator") {
                            return cb(null, error);
                        }
                    }
                }
                user.deleteById(userToDelete.id, function(err) {
                    if(err) console.log("> error deleting user:", userToDelete.email);
                    console.log("> user deleted:", userToDelete.email);
                    return cb(null, null, userToDelete.email);
                });
            });
        });
    };

    user.remoteMethod(
        'deleteUser',
        {
            description: 'Delete user by passing email to delete and id of the user making the request.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id making request'},
                { arg: 'email', type: 'string', required: true, description: 'User email to delete'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'email', type: 'String'}
            ],
            http: { verb: 'delete', path: '/deleteUser/:id' }
        }
    );
    
    user.changeEditorConfig = function(id, softTabs, theme, cb) {
        user.findById(id, function(err, user) {
            if (err)
                return cb(err);
            if (softTabs || theme)
            {
                var editorConfig = user.editorConfig;
                if (softTabs)
                {
                    editorConfig.softTabs = softTabs;
                    user.updateAttributes({ editorConfig: editorConfig }, function() {
                        if (err)
                        {
                            console.log('> failed changing softTabs for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                if (theme)
                {
                    editorConfig.theme = theme;
                    user.updateAttributes({ editorConfig: editorConfig}, function() {
                        if (err)
                        {
                            console.log('> failed changing theme for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                var newData = {
                    theme: theme,
                    softTabs: softTabs
                };
                return cb(null, null, newData);
            }
            else
            {
                console.log('> no data to change for: ', user.email);
                var error = {
                    message: 'No data to change'
                };
                return cb(null, error);
            }
        });
    };
    
    user.remoteMethod(
        'changeEditorConfig',
        {
            description: "Change user's editor configuration options",
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id' },
                { arg: 'softTabs', type: 'string', required: false, description: 'Soft tabs' },
                { arg: 'theme', type: 'string', required: false, description: 'Theme' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'newData', type: 'Object'}
            ],
            http: { verb: 'put', path: '/:id/changeEditorConfig' }
        }
    );
};
