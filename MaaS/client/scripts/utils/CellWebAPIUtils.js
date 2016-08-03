/*
* Name: {CellWebAPIUtils.js}
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

var ResponseCellActionCreator = require('../actions/Response/ResponseCellActionCreator.react.jsx');
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
    saveCellDefinition: function(name, source) {
      request
        .post(APIEndpoints.CELLS + '/saveDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          name: name,
          source: source
        })
        .end(function(res, err) {
          if(res)
          {
            res = JSON.parse(res.text);
            if(res.error)
            {
              ResponseCellActionCreator.responseSaveCellDefinition(null, res.error.message);
            }
            else
            {
              ResponseCellActionCreator.responseSaveCellDefinition(res.definiton, null);
            }
          }
          
          
        });
    },
    overwriteCellDefinition: function(id, source) {
      request
        .put(APIEndpoints.CELLS + '/' + id + '/overwriteDefinition')
        .set('Accept', 'application/json')
        .set('Authorization', localStorage.getItem('accessToken'))
        .send({
          id: id,
          name: name,
          source: source
        })
        .end(function(res, err) {
          
        });
    }
    
};