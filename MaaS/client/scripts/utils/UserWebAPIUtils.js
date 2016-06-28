//var ServerActionCreators = require('../actions/ServerActionCreators.react.jsx');
var Constants = require('../constants/Constants.js');
var request = require('superagent');
var ReactDOM = require('react-dom');

/*function _getErrors(res) {
  var errorMsgs = ["Something went wrong, please try again"];
  if ((json = JSON.parse(res.text))) {
    if (json['errors']) {
      errorMsgs = json['errors'];
    } else if (json['error']) {
      errorMsgs = [json['error']];
    }
  }
  return errorMsgs;
}*/

var APIEndpoints = Constants.APIEndpoints;

module.exports = {

  loadUser: function(email) {
    request
      .get(APIEndpoints.USERS)
      .set('Accept', 'application/json')
      //.set('Authorization', sessionStorage.getItem('accessToken'))
      .end(function(error, res){
        /*if (res) {
          var json = JSON.parse(res.text);
          ServerActionCreators.receiveStory(json);
        }*/
        if (error){
          ReactDOM.render(<p>Errore</p>, document.getElementById('content'));
        }
      });
  }
  
};