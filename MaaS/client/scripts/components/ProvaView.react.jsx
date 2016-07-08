var React = require('react');
//var Dispatcher = require('../../dispatcher/Dispatcher.js');
//var Constants = require('../../constants/Constants.js');
//var WebAPIUtils = require('../../webAPIUtils/WebAPIUtils.js');
//var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserActionCreator = require('../actions/UserActionCreator.react.jsx');
//var RouteActionCreators = require('../../actions/RouteActionCreator.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');

var Viewer = require('./ProvaViewer.react.jsx');

function getUsersState() {
  return {
    allUsers: UserStore.getAll()
  };
}

var ProvaView = React.createClass({

  getInitialState: function() {
    return getUsersState();
  },

  componentDidMount: function() {
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    //UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getUsersState());
  },

  _onSubmit: function(e) {
    e.preventDefault();
    UserActionCreator.create(this.refs.email.value);
  },

  render: function() {
    var allUsers = this.state.allUsers;
    var users;
    if(!allUsers) {
      users = (<p>errore</p>);
    } else {
      users = allUsers.map((x) => <Viewer user={x} />);
    }

    return (
      <div>
        <form onSubmit={this._onSubmit} className="container">
            <p>Crea un utente</p>
            <input type="text" placeholder="email" name="email" ref="email" />
            <button type="submit">create(email)</button>
        </form>
        <div>
          <ul>{users}</ul>
        </div>
      </div>
     );
  }

});

module.exports = ProvaView;