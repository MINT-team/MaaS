var React = require('react');
//var Dispatcher = require('../../dispatcher/Dispatcher.js');
//var Constants = require('../../constants/Constants.js');
//var WebAPIUtils = require('../../webAPIUtils/WebAPIUtils.js');
//var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserActionCreator = require('../actions/UserActionCreator.react.jsx');
//var RouteActionCreators = require('../../actions/RouteActionCreator.react.jsx');


var ProvaView = React.createClass({

  componentDidMount: function() {
    
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var email = this.refs.email.getDOMNode().value; //non va un cazzo
    UserActionCreator.request_getUser(email);
  },
  
  render: function() {
    return (
        <form onSubmit={this._onSubmit}>
            <p id="info">Cerca un utente</p>
            <input type="text" placeholder="email" name="email" ref="email" /> 
            <button type="submit">Cerca</button>
        </form>
     );
  }

});

module.exports = ProvaView;