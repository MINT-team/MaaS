var loopback = require('loopback');
var config = require('../../server/config.json');
var app = require('../../server/server.js');
var path = require('path');
var host = 'maas-navid94.c9users.io';
var port = '8080';

var MIN_PASSWORD_LENGTH = 8;

module.exports = function(user) {


    // Registrazione - controllo credenziali
    user.signUp = function(company, email, password, confirmation, cb) {
        if(!password || !confirmation) {
            var error = {
                message: 'Insert the password and its confirmation'
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
        var Company = app.models.Company;   // working with loopback objects
        // Search for an already existing company
        Company.findOne({where: {name: company}, limit: 1}, function(err, existingCompany) {
            if(err) {
                return cb(null, err);
            }
            if(!err && existingCompany) {
                console.log('> company already exists:', existingCompany);
                error = {
                    message: 'A company with this name already exists'
                };
                return cb(null, error);   // callback di insuccesso
            }
            // If company does not exists search for an already existing user
            user.findOne({where: {email: email}, limit: 1}, function(err, existingUser) {
                if(err) {
                    return cb(null, err);
                }
                if(!err && existingUser) {
                    console.log('> user already exists:', existingUser);
                    error = {
                        message: 'A user with this email already exists'
                    };
                    return cb(null, error);   // callback di insuccesso
                }
                // Create the company
                Company.create({name: company}, function(err, companyInstance) {
                    if(err) {
                        return cb(null, err);
                    }
                    console.log('> company created:', companyInstance);
                    // Create the user and set the company has him
                    user.create({companyId: companyInstance.id, email: email, password: password}, function(err, userInstance) {
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

                        // Set that user created belongs to the company
                        userInstance.company(companyInstance);

                        // Set the user is the owner of the company
                        companyInstance.owner(userInstance);

                        // Save relations in the database
                        userInstance.save();
                        companyInstance.save();
                        //console.log('> owner of the company:', companyInstance.owner());
                        //console.log('> update company:', companyInstance);

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

    // TO DO: SIGN UP BY INVITE -> registrazione membri company

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
            user.updateAttributes({ name: name, surname: surname, dateOfBirth: dateOfBirth, gender: gender }, function() {
                if(err) {
                    console.log('> failed changing data for: ', user.email);
                    return cb(err);
                }
                console.log('> data change processed successfully for: ', user.email);
                var newData = {
                    name: name,
                    surname: surname,
                    dateOfBirth: dateOfBirth,
                    gender: gender
                };
                return cb(null, null, newData);   // callback di successo
            });
        });

    };

    user.remoteMethod(
        'changePersonalData',
        {
            description: 'Change user attributes by passing id.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id'},
                { arg: 'name', type: 'string', required: true, description: 'New name'},
                { arg: 'surname', type: 'string', required: true, description: 'New surname'},
                { arg: 'dateOfBirth', type: 'date', required: true, description: 'New date of birth'},
                { arg: 'gender', type: 'string', required: true, description: 'New gender'}
            ],
            returns: [
                {arg: 'error', type: 'Object'},
                {arg: 'newData', type: 'Object'}
            ],
            http: { verb: 'post', path: '/:id/changePersonalData' }
        }
    );

    // Elimino l'utente - vedesi relativo ACL
    user.deleteAccount = function(id, name, surname, dateOfBirth, gender, cb) {

    };

    user.remoteMethod(
        'deleteAccount',
        {
            description: 'Change user attributes by passing id.',
            accepts: [
                { arg: 'id', type: 'string', required: true, description: 'User id'}
            ],
            returns: [
                {arg: 'error', type: 'Object'}
            ],
            http: { verb: 'post', path: '/:id/deleteAccount' }
        }
    );

};
