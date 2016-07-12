var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../stores/UserStore.react.jsx');
var UserActionCreator = require('../actions/UserActionCreator.react.jsx');

function getState() {
  return {
    //accessToken: RecoverPwd.getState().accessToken,
    //userId: RecoverPwd.getState().userId,
    email:  UserStore.getUser().email,
    errors: UserStore.getErrors()
  };
}

var RecoverPwd = React.createClass({

  getInitialState: function() {
      return {
          accessToken: this.props.location.query.access_token,
          userId: this.props.location.query.uid,
          email: null,
          errors: []
      };
  },

  componentDidMount: function() {
      //console.log(this.props);  // visibile da chrome premendo F12 -> Console
      //sessionStorage.setItem('accessToken', this.state.accessToken);
      UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

  _onSubmit: function(event) {
      event.preventDefault();   //evita il ricaricamento della pagina da parte della form
      var password = this.refs.password.value;
      var confirmation = this.refs.confermaPassword.value;
      var id = this.state.userId;
      var accessToken = this.state.accessToken;
      UserActionCreator.changePassword(id, password, confirmation, accessToken);
  },

  render: function() {
    var title, content, errors;
    if(this.state.email && (!this.state.errors.length > 0)) { // in questo caso l'email serve solo per controllo
      title = "Password changed successfully!";
      content = (
        <div id="successful-registration">
          <p>You changed your password, now you can log into MaaS.</p>
          <Link id="successful-registration-login" className="button" to="/login">Go to Login</Link>
        </div>
      );
    } else {
      title = "Choose a new password";
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
      }
      content = (
        <form onSubmit={this._onSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref="password" required/>
          </div>
          <div className="form-field">
            <label htmlFor="confermaPassword">Confirm Password</label>
            <input type="password" id="confermaPassword" ref="confermaPassword" required/>
          </div>
          {errors}
          <button type="submit" className="form-submit">Set password</button>
        </form>
      );
    }
    return (
      <div className="container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
  }
});

module.exports = RecoverPwd;