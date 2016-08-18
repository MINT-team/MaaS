// Name: {user.js}
// Module: {Back-end::Models}
// Location: {/MaaS/common/models/}

// History:
// Version         Date            Programmer
// ==========================================

var loopback = require('loopback');
var app = require('../../server/server.js');
var path = require('path');

var HOST_NAME = process.env.HOST_NAME;
var HOST_URL = process.env.HOST_URL;
var PORT = process.env.HOST_PORT;
var API_ROOT = process.env.API_ROOT;
var MIN_PASSWORD_LENGTH = 8;
var INVITATION_TTL = 1209600; // 2 weeks in seconds

module.exports = function(user) {

    // Registrazione proprietario - controllo credenziali
    user.signUp = function(company, email, password, confirmation, cb) {
        if(!password || !confirmation) 
        {
            var error = { message: 'Insert the password and its confirmation' };
            return cb(null, error);   // callback di insuccesso
        }
        if(password != confirmation) 
        {
            error = { message: 'Password confirmation doesn\'t match' };
            return cb(null, error);   // callback di insuccesso
        }
        if(password.length < MIN_PASSWORD_LENGTH) 
        {
            error = { message: 'Password is too short, the minumum lenght is ' + MIN_PASSWORD_LENGTH + ' characters' };
            return cb(null, error);   // callback di insuccesso
        }
        // Search for an already existing company
        var Company = app.models.Company;
        Company.findOne({where: {name: company}, limit: 1}, function(err, existingCompany) {
            if(err) 
                return cb(null, err);
            if(!err && existingCompany) 
            {
                console.log('> Company already exists:', existingCompany);
                error = { message: 'A company with this name already exists' };
                return cb(null, error);   // callback di insuccesso
            }
            // If company does not exists search for an already existing user
            user.findOne({where: {email: email}, limit: 1}, function(err, existingUser) {
                if(err) 
                    return cb(null, err);
                if(!err && existingUser) 
                {
                    console.log('> User already exists:', existingUser);
                    error = {
                        message: 'A user with this email already exists'
                    };
                    return cb(null, error);   // callback di insuccesso
                }
                // Create the company
                Company.create({name: company}, function(err, companyInstance) {
                    if(err) 
                        return cb(null, err);
                    console.log('> Company created:', companyInstance);
                    // Create the user and set the company has him
                    user.create({companyId: companyInstance.id, email: email, password: password, role: "Owner"}, function(err, userInstance) {
                        if(err) 
                        {
                            Company.destroyById(companyInstance.id, function(err) {
                                if(err) 
                                {
                                    console.log("> Error destroying the company after an error occurred creating the user. Please clean your database, company id:", companyInstance.id);
                                    return cb(null, err);
                                }
                            });
                            console.log("> Error creating the user, company destroyed");
                            return cb(null, err);
                        }
                        console.log('> User created:', userInstance);
                        userInstance.company(companyInstance);  // Set that user created belongs to the company
                        companyInstance.owner(userInstance);    // Set the user is the owner of the company, dynamic role $owner
                        // Save relations in the database
                        userInstance.save();
                        companyInstance.save();
                        // Send verification email after registration
                        var options = {
                            type: 'email',
                            host: HOST_NAME,
                            to: userInstance.email,
                            from: 'noreply@maas.com',
                            subject: 'Welcome to MaaS',
                            text: 'Please click on the link below to verify your email address and complete your registration:',
                            template: path.resolve(__dirname, '../../server/views/verify.ejs'),
                            redirect: '/%23/login', // percent encoding => /#/login
                            user: userInstance
                        };
                        userInstance.verify(options, function(err, response) {
                            if(err) 
                            {
                                //return next(err);
                                return cb(null, err);
                            }
                            console.log('> Verification email sent:', response);
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

    // Send password reset link when requested
    user.on('resetPasswordRequest', function(info) {
        var url = HOST_URL + ':' + PORT + '/';
        var template = loopback.template(path.resolve(__dirname, '../../server/views/reset.ejs'));
        var options = {
            resetHref: '' + url + '#/recoverpwd?uid=' + info.user.id + '&access_token=' + info.accessToken.id + ''
        };
        var html = template(options);

        user.app.models.Email.send({
            to: info.email,
            from: 'noreply@maas.com',
            subject: 'Password reset',
            html: html
        }, function(err) {
            if (err)
            {
                return console.log('> Error sending password reset email');
            }
            console.log('> Sending password reset email to:', info.email);
        });
    });

    // Send invitation link when requested
    user.invite = function(info, cb) {
        // Check if company exists
        app.models.Company.findOne({where: {name: info.company}, limit: 1}, function(err, companyInstance) {
            if(err)
                return cb(err);
            // Initialize user account
            user.create({email: info.email, password: ' ', role: info.role, companyId: companyInstance.id}, function(err, userInstance) {
                if(err)
                    return cb(err);
                // Create a verification token to confirm the user
                user.generateVerificationToken(userInstance, function(err, token) {
                    if (err) 
                    {
                        return cb(err);
                    }
                    userInstance.verificationToken = token;
                    userInstance.save(function(err) {
                        if(err)
                        { 
                            return cb(err); 
                        }
                    });
                    // Create another token to set a new password after confirmation
                    userInstance.accessTokens.create({ ttl: INVITATION_TTL }, function(err, accessToken) {
                        if (err) { return cb(err); }
                        var url = HOST_URL + ':' + PORT + API_ROOT + '/users/confirm';
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
                            if (err)
                            {
                                console.log('> Error sending invitation email');
                                return cb(null, "Error sending invitation email", null);
                            }
                            console.log('> Sending invitation email to:', info.email);
                            return cb(null, null, info.email);
                        });
                    });
                });
                // Change DSL list of the user
                if(userInstance.role == "Administrator")
                {
                    var DSL = app.models.DSL;
                    var DSLAccess = app.models.DSLAccess;
                    user.findOne({where: {role: "Owner", companyId: userInstance.companyId},limit: 1}, function(err, owner) {
                        if(err || !owner)
                        {
                            return cb(err);
                        }
                        owner.dsl({ where: {} }, function(err, DSLList) {
                            if(err || !DSLList)
                            {
                                return cb(err);
                            }
                            DSLList.forEach(function(DSLInstance, i) {
                                DSLAccess.create({userId: userInstance.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                                    if(err)
                                    {
                                        console.log("> Error creating relationship for the DSL");
                                        return cb(err, null, null);
                                    }
                                });
                            });
                        });
                    });
                }
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
                {arg: 'error', type: 'Object'},
                {arg: 'email', type: 'string'}
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
        console.log("user id: ", id);
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
                    console.log('> Failed resetting password for: ', user.email);
                    return cb(err);
                }
                console.log('> Password changed successfully for: ', user.email);
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
            http: { verb: 'put', path: '/:id/changePassword' }
        }
    );

    // Cambio i dati anagrafici - vedesi relativo ACL
    user.changePersonalData = function(id, name, surname, dateOfBirth, gender, cb) {
        user.findById(id, function(err, user) {
            if(err)
                return cb(err);
            if(name != user.name || surname != user.surname || dateOfBirth.valueOf() || gender != user.gender) 
            {
                if(name) 
                {
                    user.updateAttributes({ name: name }, function() {
                        if(err) 
                        {
                            console.log('> Failed changing name for: ', user.email);
                            return cb(err);
                        }
                    });
                }
                if(surname) 
                {
                    user.updateAttributes({ surname: surname }, function() {
                        if(err) 
                        {
                            console.log('> Failed changing surname for: ', user.email);
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
                            console.log('> Failed changing gender for: ', user.email);
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
                console.log('> Personal data changed successfully for: ', user.email);
                return cb(null, null, newData);   // callback di successo
            } 
            else 
            {
                console.log('> No data to change for: ', user.email);
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
            http: { verb: 'put', path: '/:id/changePersonalData' }
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
                // User trying to delete another user
                if(userInstance.email != userToDelete.email) 
                {
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
                // User trying to delete his own account
                }
                else
                {
                    if(userToDelete.role == "Owner") 
                    {
                        error = {
                            message: 'You are the Owner of this company, you can\'t simply delete your account. Delete your company first.'
                        };
                        return cb(null, error);
                    }
                }
                // Successful request
                userToDelete.dsl({ where: {} }, function(err, DSLList) {
                    if(err || !DSLList)
                    {
                        return cb(err);
                    }
                    // Remove DSL accesses
                    DSLList.forEach(function(DSLInstance, i) {
                        userToDelete.dsl.remove(DSLInstance, function(err) {
                            if(err)
                            {
                                console.log("> Error removing DSL from user to delete");
                                return cb(err);
                            }
                        });
                    });
                    // Delete the user
                    user.deleteById(userToDelete.id, function(err) {
                        if(err) 
                        {
                            console.log("> Error deleting user:", userToDelete.email);
                            return cb(err);
                        }
                        console.log("> User deleted:", userToDelete.email);
                        return cb(null, null, userToDelete.email);
                    });
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
            http: { verb: 'delete', path: '/:id/deleteUser' }
        }
    );
    
    // Cambio il ruolo dell'utente
    user.changeRole = function(id, email, role, cb) {
        user.findById(id, function(err, userInstance) {
            if(err || !userInstance)
                return cb(err, null, null);
            user.findOne({where: {companyId: userInstance.companyId, email: email}, limit: 1}, function(err, userToChange) {
                if(err)
                {
                    console.log(err);
                    
                }
                if(!userToChange)
                {
                    console.log("non trovato");
                    var error = {
                        message: 'User to change role not found'
                    };
                    return cb(null, error, null);
                }
                // user trying to change role of another user, only this case is allowed
                if(userInstance.email != userToChange.email) 
                {
                    error = {
                        message: 'You haven\'t the rights to change this user'
                    };
                    if(userInstance.role != "Owner" && userInstance.role != "Administrator")
                    {
                        return cb(null, error);
                    }
                    // if userInstance.role == "Owner" then he's allowed to
                    if(userInstance.role == "Administrator") 
                    {
                        if(userToChange.role == "Owner" || userToChange.role == "Administrator")
                        {
                            return cb(null, error);
                        }
                    }
                    // successful request
                    userToChange.updateAttributes({ role: role }, function(err, updatedUser) {
                        if(err)
                        {
                            var error = {
                                message: 'Failed changing role for: '+userToChange.email
                            };
                            console.log('> Failed changing role for: ', userToChange.email);
                            return cb(null, error);
                        }
                        else
                        {
                            // Change DSL list
                            var DSL = app.models.DSL;
                            var DSLAccess = app.models.DSLAccess;
                            if(updatedUser.role == "Administrator")
                            {
                                user.findOne({where: {role: "Owner", companyId: updatedUser.companyId},limit: 1}, function(err, owner) {
                                    if(err || !owner)
                                    {
                                        return cb(err);
                                    }
                                    owner.dsl({ where: {} }, function(err, DSLList) {
                                        if(err || !DSLList)
                                        {
                                            return cb(err);
                                        }
                                        updatedUser.dsl({ where: {} }, function(err, oldDSLList) {
                                            if(err || !oldDSLList)
                                            {
                                                return cb(err);
                                            }
                                            // Clean old DSL accesses
                                            oldDSLList.forEach(function(oldDSLInstance, i) {
                                                updatedUser.dsl.remove(oldDSLInstance, function(err) {
                                                    if(err)
                                                    {
                                                        console.log("> Error removing DSL from user while changing his role");
                                                        return cb(err);
                                                    }
                                                });
                                            });
                                            // Create new DSL accesses
                                            DSLList.forEach(function(DSLInstance, i) {
                                                DSLAccess.create({userId: updatedUser.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                                                    if(err)
                                                    {
                                                        console.log("> Error creating relationship for the DSL");
                                                        return cb(err, null, null);
                                                    }
                                                });
                                            });
                                        });
                                        
                                    });
                                });
                            }
                            if(updatedUser.role == "Member")
                            {
                                user.findOne({where: {role: "Owner", companyId: updatedUser.companyId},limit: 1}, function(err, owner) {
                                    if(err || !owner)
                                    {
                                        return cb(err);
                                    }
                                    owner.dsl({ where: {} }, function(err, DSLList) {
                                        if(err || !DSLList)
                                        {
                                            return cb(err);
                                        }
                                        updatedUser.dsl({ where: {} }, function(err, oldDSLList) {
                                            if(err || !oldDSLList)
                                            {
                                                return cb(err);
                                            }
                                            // Clean old DSL accesses
                                            oldDSLList.forEach(function(oldDSLInstance, i) {
                                                updatedUser.dsl.remove(oldDSLInstance, function(err) {
                                                    if(err)
                                                    {
                                                        console.log("> Error removing DSL from user while changing his role");
                                                        return cb(err);
                                                    }
                                                });
                                            });
                                            // Add DSL accesses if definitions are created by updatedUser
                                            DSLList.forEach(function(DSLInstance, i) {
                                                if(DSLInstance.createdBy == updatedUser.id)
                                                {
                                                    DSLAccess.create({userId: updatedUser.id, dslId: DSLInstance.id, permission: "write"}, function(err, accessInstance) {
                                                        if(err)
                                                        {
                                                            console.log("> Error creating relationship for the DSL");
                                                            return cb(err, null, null);
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                        
                                    });
                                });
                            }
                            if(updatedUser.role == "Guest")
                            {
                                updatedUser.dsl({ where: {} }, function(err, DSLList) {
                                    if(err || !DSLList)
                                    {
                                        return cb(err);
                                    }
                                    // Clean all DSL accesses
                                    DSLList.forEach(function(DSLInstance, i) {
                                        updatedUser.dsl.remove(DSLInstance, function(err) {
                                            if(err)
                                            {
                                                console.log("> Error removing DSL from user while changing his role");
                                                return cb(err);
                                            }
                                        });
                                    });
                                });
                            }
                            // Response
                            console.log("> Role changed for:", updatedUser.email);
                            return cb(null, null, updatedUser.email);
                        }
                    });
                }
            });
        });
    };

    user.remoteMethod(
        'changeRole',
        {
            description: 'Change user role by passing email to change role for and id of the user making the request.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id making request'},
                { arg: 'email', type: 'string', required: true, description: 'User email to change role for'},
                { arg: 'role', type: 'string', required: true, description: 'New role'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'email', type: 'String'}
            ],
            http: { verb: 'put', path: '/:id/changeRole' }
        }
    );
    
    user.changeEditorConfig = function(id, softTabs, theme, tabSize, fontSize, cb) {
        user.findById(id, function(err, user) {
            if (err)
                return cb(err);
            if (softTabs != user.editorConfig.softTabs || theme != user.editorConfig.theme || tabSize != user.editorConfig.tabSize 
            || fontSize != user.editorConfig.fontSize)
            {
                var editorConfig = user.editorConfig;
                editorConfig.softTabs = softTabs;
                editorConfig.theme = theme;
                editorConfig.tabSize = tabSize;
                editorConfig.fontSize = fontSize;
                user.updateAttributes({ editorConfig: editorConfig }, function() {
                    if (err)
                    {
                        console.log('> Failed changing editor configuration for: ', user.email);
                        return cb(err);
                    }
                });
                var newData = {
                    theme: theme,
                    softTabs: softTabs,
                    tabSize: tabSize,
                    fontSize: fontSize
                };
                return cb(null, null, newData);
            }
            else
            {
                console.log('> No data to change for: ', user.email);
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
                { arg: 'theme', type: 'string', required: false, description: 'Theme' },
                { arg: 'tabSize', type: 'string', required: false, description: 'Tab size' },
                { arg: 'fontSize', type: 'string', required: false, description: 'Font size' }
            ],
            returns: [
                { arg: 'error', type: 'Object' },
                { arg: 'newData', type: 'Object'}
            ],
            http: { verb: 'put', path: '/:id/changeEditorConfig' }
        }
    );
    
    
    user.changeUserEmail = function(id, email, confirmationEmail, cb) {
       
         user.findOne({where: {email: email}, limit: 1}, function(err, existingEmail) {
             
            if(err)  console.log('> find email error');
            if(!existingEmail)
            {
                user.findById(id, function(err, user) {
                    if (err)
                       return cb(err);
                   if(email == confirmationEmail)
                   {
                    user.updateAttributes({ email: email }, function() {
                    if (err)
                    {
                        console.log('> Failed changing email configuration for: ', id);
                        return cb(err);
                    }
                    });
                    
                    var data = {
                        id: id,
                        newEmail: email
                    };
                    return cb(null, null, data);
                    }
                    else
                    {
                        var error = {
                            message: 'there is a difference between e-mail and email confirmation'
                        };
                        return cb(null, error, null);
                    }
                });
            }else
            {
                if(confirmationEmail.length == 0)
                {
                    var error = {
                        message: 'enter the email confirmation'
                    };
                    return cb(null, error, null); 
                }else
                {
                    var error = {
                        message: 'email is already used'
                    };
                    return cb(null, error, null);
                }
            } 
         });
    };
    
    user.remoteMethod(
        'changeUserEmail',
        {
            description: 'Change user email by passing id to change email for, email and confirmation of the same.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User ID which you want to change the e-mail'},
                { arg: 'email', type: 'string', required: true, description: 'New email'},
                { arg: 'confirmationEmail', type: 'string', required: true, description: 'Confirmation of the new e-mail'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'data', type: 'Object'}
            ],
            http: { verb: 'put', path: '/:id/changeUserEmail' }
        }
    );
    
    
    
    
    
    
    
    
    // Add specifications on wich user has logged in
    user.afterRemote('login', function(ctx, remoteMethodOutput, next) {
        var ctx_ttl = ctx.result.ttl ;
        var ctx_userId = ctx.result.userId ;
        var ctx_created = ctx.result.created ;
        var ctx_id = ctx.result.id ;
        var ctx_type = "commonUser";
    
        ctx.result = {
                ttl: ctx_ttl,
                userId: ctx_userId,
                created :ctx_created,
                id: ctx_id,
                type: ctx_type
            };
            
        next();
    });
    
    
    
   //remote hook for fix the information of getuses
    user.afterRemote('find', function(ctx, remoteMethodOutput, next) {
        
        var Company = app.models.Company;
        var userList = ctx.result;
        if(userList.length == 0) next();
        userList.forEach(function(userInstance, i) {
       
           //recovery of the interesting data from the response
            var companyId = userList[i].companyId;
            var companyName = "null";
            var userId = userList[i].id;
            var userEmail = userList[i].email;
            var userRole = userList[i].role;   
            
           //Research of the company with id = companyId
            Company.findById(companyId, function(err, results) {
                if(err) 
                    console.log("error, cannot find company");
                if(results)
                {
                    companyName = results.name;
                   //saving interesting data
                    ctx.result[i] = {
                        email: userEmail,
                        role: userRole,
                        id: userId,
                        companyName: companyName 
                    };   
                   //exit condition
                    if(i == (userList.length)-1) next();
                }
                else
                    console.log("error, cannot find company"); 
            });
        });
        
    });
    
    
    
    
};


