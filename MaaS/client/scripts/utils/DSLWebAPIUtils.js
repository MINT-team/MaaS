/*
* Name: {DSLWebAPIUtils.js}
* Module: {Front-end}
* Location: {/MaaS/client/scripts/utils/}
* 
* History:
* Version         Date            Programmer
* ===================================================
* 0.0.1        2016/08/02   Navid Taha, Fabiano Tavallini
* ---------------------------------------------------
* First structure of the file.
* ===================================================
*/

var ResponseDSLActionCreator = require('../actions/Response/ResponseDSLActionCreator.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');

function _getErrors(json) {
  var error, message;
    if(json.message) {
        message = json.message;
        // Other cases
        if(!error) {
            error = message;
        }
    }
    return error;
}

var APIEndpoints = Constants.APIEndpoints;

module.exports = {
    saveDSLDefinition: function(type, name, source) {
      request
        .post(APIEndpoints.DSL + '/saveDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          type: type,
          name: name,
          source: source
        })
        .end(function(err, res) {
          if(res)
          {
            res = JSON.parse(res.text);
            if(res.error)
            {
              alert('Errore:  '+ res.error.message);
              ResponseDSLActionCreator.responseSaveDSLDefinition(null, res.error.message);
            }
            else
            {
              ResponseDSLActionCreator.responseSaveDSLDefinition(res.definition, null);
            }
          }
        });
    },
    
    overwriteDSLDefinition: function(id, source) {
      request
        .put(APIEndpoints.DSL + '/' + id + '/overwriteDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          id: id,
          name: name,
          source: source
        })
        .end(function(err, res) {
          
        });
    },
    
    loadDSL: function(id) {
      request
        .get(APIEndpoints.DSL + '/' + id)
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .end(function(error, res) {
          if (res)
          {
            
          }
        });
    }
    
};