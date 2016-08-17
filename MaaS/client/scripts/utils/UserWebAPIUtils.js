// Name: {UserWebAPIUtils.js}
// Module: {Front-end::WebAPIUtils}
// Location: {/MaaS/client/scripts/utils/}

// History:
// Version         Date            Programmer
// ==========================================

var ResponseUserActionCreator = require('../actions/Response/ResponseUserActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');


function _getErrors(json) {
  var error, message;
    if(json.message) 
    {
        message = json.message;
        // Email
        if(JSON.stringify(message).match(/mail/)) 
        {
          error = "Email not found, insert your registered email";
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

  resetPassword: function(email) {
    request
      .post(APIEndpoints.USERS + '/reset')
      .set('Accept', 'application/json')
      //.set('Authorization', localStorage.getItem('accessToken'))
      .send({ email: email })
      .end(function(err, res){
        if(res) 
        {
          if(res.error) 
          {
            var errors = _getErrors(res.body.error);
            ResponseUserActionCreator.responseResetPassword(null, errors);
          } 
          else 
          {
            //var json = JSON.parse(res.text);  //res ritorna vuoto!
            var json = { email: email};
            ResponseUserActionCreator.responseResetPassword(json, null);
          }
        }
      });
  },

  changePassword: function(id, password, confirmation, accessToken){ //accessToken come parametro obbligatorio
    request
      .put(APIEndpoints.USERS + '/' + id + '/changePassword')
      .set('Accept', 'application/json')
      .set('Authorization', accessToken)  // necessario per questa API, in questo caso viene passato a mano perchè potrebbe provenire dalla query url - vedesi 'ChangePassword.react.jsx'
      //.type('form')
      //.set('Content-Type', 'application/x-www-form-urlencoded')
      .send({
        id: id,
        password: password,
        confirmation: confirmation
      })
      .end(function(err, res){
        if(res) 
        {
          //console.log(res);
          res = JSON.parse(res.text);
          if(res.error) 
          {
            // res.error.message: errori di loopback e error definito dal remote method
            ResponseUserActionCreator.responseChangePassword(null, res.error.message);
          }
          else 
          {
            ResponseUserActionCreator.responseChangePassword(res.email, null);
          }
        }
      });
  },

  changePersonalData: function(id, name, surname, dateOfBirth, gender) {
    request
      .put(APIEndpoints.USERS + '/' + id + '/changePersonalData')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))  // necessario per questa API
      .send({
        id: id,
        name: name,
        surname: surname,
        dateOfBirth: dateOfBirth,
        gender: gender
      })
      .end(function(err, res) {
        if(res) 
        {
          res = JSON.parse(res.text);
          if(res.error) 
          {
            // res.error.message: errori di loopback e error definito dal remote method
            ResponseUserActionCreator.responseChangePersonalData(null, res.error.message);
          } 
          else 
          {
            ResponseUserActionCreator.responseChangePersonalData(res.newData, null);
          }
        }
        if(err) 
        {
          //ResponseUserActionCreator.responseChangePassword(null, err);
        }
      });
  },

  // get user data
  getUser: function(id) {
    request
      .get(APIEndpoints.USERS + '/' + id)
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(error, res) {
        if(res) 
        {
          ResponseUserActionCreator.responseGetUser(res.body);
        }
      });
  },
  
  // delete user account
  deleteUser: function(email, id) {
    request
      .del(APIEndpoints.USERS + '/' + id + '/deleteUser')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        email: email
      })
      .end(function(error, res) {
        if(res) 
        {
           res = JSON.parse(res.text);
          if(res.error) 
          {
            // res.error.message: errori di loopback e error definito dal remote method
            ResponseUserActionCreator.responseDeleteUser(res.error.message, null);
          } 
          else 
          {
            ResponseUserActionCreator.responseDeleteUser(null, res.email);
          }
        }
      });
  },

  // get the user company
  getCompany: function(userId) {
    request
      .get(APIEndpoints.USERS + '/' + userId + '/company')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(error, res) {
        if(res) 
        {
          ResponseUserActionCreator.responseGetCompany(res.body);
        }
      });
  },

  getEditorConfig: function(userId) {
    request
      .get(APIEndpoints.USERS + '/' + userId + '/editorConfig')
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(error, res) {
        if(res) 
        {
          var json = JSON.parse(res.text);
          ResponseUserActionCreator.responseGetEditorConfig(json);
        }
      });
  },
  
  changeEditorConfig: function(id,softTabs,theme, tabSize, fontSize) {
    request
      .put(APIEndpoints.USERS + '/' + id + '/changeEditorConfig')
      .set('Accept','application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        id: id,
        softTabs: softTabs,
        theme: theme,
        tabSize: tabSize,
        fontSize: fontSize
      })
      .end(function(error, res) {
        if (res)
        {
          res = JSON.parse(res.text);
          if (res.error)
          {
            ResponseUserActionCreator.responseChangeEditorConfig(null,res.error.message);
          }
          else
          {
            ResponseUserActionCreator.responseChangeEditorConfig(res.newData, null);
          }
        }
      });
  },
  
  changeRole: function(email, role, id) {
    request
      .put(APIEndpoints.USERS + '/' + id + '/changeRole')
      .set('Accept','application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .send({
        email: email,
        role: role
      })
      .end(function(error, res) {
        if (res)
        {
          res = JSON.parse(res.text);
          if (res.error)
          {
            ResponseUserActionCreator.responseChangeRole(null,res.error.message);
          }
          else
          {
            ResponseUserActionCreator.responseChangeRole(res.email, null);
          }
        }
      });
  },
    //get all the users of MaaS
   getUsers: function() {
     request
      .get(APIEndpoints.USERS)
      .set('Accept', 'application/json')
      .set('Authorization', localStorage.getItem('accessToken'))
      .end(function(error, res) {
        if(res) 
        {
          ResponseUserActionCreator.responseGetUsers(res.body);
        }
      });
   }
};