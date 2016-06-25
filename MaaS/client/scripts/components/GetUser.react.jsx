var React = require('react');
var WebAPIUtils = require('../../utils/UserWebAPIUtils.js');
var UserStore = require('../../stores/UserStore.react.jsx');
var UserActionCreators = require('../../actions/UserActionCreators.react.jsx');
//var State = require('react-router').State;

var GetUser = React.createClass({
  
  //mixins: [ State ],

  getInitialState: function() {
    return { 
      user: UserStore.getUser()
      //errors: []
    };
  },
 
  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
    UserActionCreators.request_getUser(this.getParams().email);
  },

  componentWillUnmount: function() {
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({ 
      user: UserStore.getUser()
      //errors: StoryStore.getErrors()
    }); 
  },
  
  render: function() {
    return (
      <div id="user">{this.state.user.email}</div>
     );
  }

});

module.exports = GetUser;