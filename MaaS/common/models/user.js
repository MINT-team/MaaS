var loopback = require('loopback');
var config = require('../../server/config.json');
var path = require('path');
var host = 'maas-navid94.c9users.io';
var port = '8080';

module.exports = function(user) {

    // Registrazione - controllo credenziali
    user.signUp = function(company, email, password, confirmation, cb) {

        if(!password || !confirmation) {
            var error = {
                message: 'Insert the password and its confirmation'
            };
            return cb(null, error);   // callback di insuccesso
        }
        /*
        var Company = app.models.Company;
        Company.create({name: company}, function(err, companyInstance) {
            console.log('> company created:', companyInstance);
        });
        */
        user.create({email: email, password: password}, function(err, userInstance) {
            if(err) {
                return cb(err);
            }
            console.log('> user created:', userInstance);
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
            http: { verb: 'post', path: '/:id/changePassword' }
        }
    );

    // Send verification email after registration
    user.afterRemote('create', function(context, user, next) {

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
    });

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
                return console.log('> ERROR sending password reset email');
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
            user.updateAttribute('password', password, function(err, user) {
                if(err)
                    return cb(err);
                console.log('> password reset processed successfully for: ', user.email);
                //console.log('user:', user);
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

};
