var React = require('react');
var Dispatcher = require('../../dispatcher/Dispatcher.js');
var Constants = require('../../constants/Constants.js');
var WebAPIUtils = require('../../webAPIUtils/WebAPIUtils.js');
//var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserActionCreator = require('../../actions/UserActionCreator.react.jsx');
//var RouteActionCreators = require('../../actions/RouteActionCreator.react.jsx');

ReactDOM.render(
      <h1>Ciao</h1>,
      document.getElementById('content')
    );

var provaView = React.createClass({

  componentDidMount: function() {
    
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    UserActionCreator.request_getUser(email);
  },
  
  render: function() {
    return (
        <form onSubmit={this._onSubmit}>
            <input type="text" placeholder="Title" name="email" ref="email" /> 
            <button type="submit">GET</button>
        </form>
     );
  }

});

module.exports = provaView;