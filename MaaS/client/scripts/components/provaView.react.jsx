/*var React = require('react');
var Dispatcher = require('../../dispatcher/Dispatcher.js');
var Constants = require('../../constants/Constants.js');
var WebAPIUtils = require('../../webAPIUtils/WebAPIUtils.js');
//var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserActionCreator = require('../../actions/UserActionCreator.react.jsx');
//var RouteActionCreators = require('../../actions/RouteActionCreator.react.jsx');


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

module.exports = provaView;*/

var React = require('react'),
    ListItem = require('./home.react.jsx');

var ListItems = React.createClass({
  render: function() {

    var words = [
      {
        "origin": "accogliere",
        "translation": "to welcome"
      },
      {
        "origin": "affrettarsi",
        "translation": "to hurry"
      },
      {
        "origin": "ammettere",
        "translation": "to admit"
      }
    ];

    var listItems = words.map(function(item){
      return <ListItem item={item} />;
    });

    return (
     <ul className="list-group">
     {listItems}
     </ul>
    );
  }
});

module.exports = ListItem;