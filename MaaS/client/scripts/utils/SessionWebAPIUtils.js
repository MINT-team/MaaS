// Name: {SessionWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseSessionActionCreator = require('../actions/Response/ResponseSessionActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

//var ReactDOM = require('react-dom');

function _getErrors(json) {
    var error, message, email;
    // Email
    if(json.details && json.details.codes)
    {
        if(json.details.codes.email)
        {
            email = json.details.codes.email;
            if(JSON.stringify(email).match(/uniqueness/))
            {
                error = "Email already exists";
            }
            if(JSON.stringify(email).match(/format/))
            {
                error = "Invalid email";
            }
            if(JSON.stringify(email).match(/presence/))
            {
                error = "Insert an email";
            }
        }
    }
    else if(json.message)
    {
        message = json.message;
        // Password
        if(JSON.stringify(message).match(/password/))
        {
            error = "Invalid password";
        }
        // Login
        if(JSON.stringify(message).match(/login failed/))
        {
            error = "Email and password are incorrect";
        }
        // Email verification
        if(JSON.stringify(message).match(/email has not been verified/))
        {
            error = "You have to verify your email first";
        }
        // Other cases
        if(!error)
        {
            error = message;
        }
    }
    return error;
}

var APIEndpoints = Constants.APIEndpoints;

module.exports = {

    signup: function(company, email, password, confirmation) {
        request.post(APIEndpoints.USERS + '/signUp')
        .send({
            company: company,
            email: email,
            password: password,
            confirmation: confirmation
        })
        .set('Accept', 'application/json')
        .end(function(err, res) {
            if(res)
            {
                console.log(res);
                if(res.body.error)
                {
                    var errors = _getErrors(res.body.error);
                    ResponseSessionActionCreator.responseSignup(null, errors);
                }
                else
                {
                    var json = {
                        email: res.body.email,
                        company: res.body.company
                    };
                    ResponseSessionActionCreator.responseSignup(json, null);
                }
            }
            if(err)
            {
                //var errorMsgs = _getErrors(err);  //ampliare questa funzione per usarla con "err"
                //ServerActionCreators.recieveSignup(null, errorMsgs);
            }
        });
    },

    login: function(email, password) {
        request.post(APIEndpoints.USERS + '/login')
        .send({
            email: email,
            password: password
        })
        .set('Accept', 'application/json')
        .end(function(err, UserRes){
            if(UserRes)
            {
                if(UserRes.error)
                {
                   request.post(APIEndpoints.SUPERADMINS + '/login')
                   .send({
                        email: email,
                        password: password
                    })
                    .set('Accept', 'application/json')
                    .end(function(err, SuperAdminRes){
                         if(SuperAdminRes)
                         {
                            if(SuperAdminRes.error)
                            {   //incorrect User and SuperAdmin credentials
                                var errors = _getErrors(SuperAdminRes.body.error);
                                ResponseSessionActionCreator.responseLogin(null, errors);
                            }
                            else
                            {
                                var json = JSON.parse(SuperAdminRes.text);
                                ResponseSessionActionCreator.responseLogin(json, null);
                            }
                         }
                    });

                    // var errors = _getErrors(UserRes.body.error);
                    // ResponseSessionActionCreator.responseLogin(null, errors);
                }
                else
                {    //successfully logged in user
                    var json = JSON.parse(UserRes.text);
                    ResponseSessionActionCreator.responseLogin(json, null);
                }
                //var errorMsgs = _getErrors(res);
                //ServerActionCreators.recieveLogin(null, errorMsgs);
                //var json = JSON.parse(res.text);<p>Email: {json.email}</p><p>Password: {json.password}</p>
                //ReactDOM.render(<div>{res.text}</div>, document.getElementById('content'));
            }
            if(err)
            {
                //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
            }
        });
    },

    invite: function(sender, company, role, email) {
        request.post(APIEndpoints.USERS + '/invite')
        .send({
            info: {
                sender: sender,
                company: company,
                role: role,
                email: email
            }
        })
        .set('Accept', 'application/json')
        .set('Authorization', sessionStorage.getItem('accessToken'))
        .end(function(err, res){
            if(res.error || err)
            {
                console.log(res.error);
                var errors = _getErrors(res.body.error);
                ResponseSessionActionCreator.responseInvite(errors);
            }
            else
            {
                ResponseSessionActionCreator.responseInvite(null);
            }
        });
    },

    logout: function(accessToken) {
        request.post(APIEndpoints.USERS + '/logout')
        .query({
            access_token: accessToken
        })
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(res)
            {
                //ReactDOM.render(<div>{res.text}</div>, document.getElementById('content'));
            }
            if(err)
            {
                //ReactDOM.render(<p>Errore: {err.status} {err.message}</p>, document.getElementById('content'));
            }
        });
    }

};