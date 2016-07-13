var React = require('react');
var Link = require('react-router').Link;
var SessionActionCreator = require('../actions/SessionActionCreator.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');

function getState() {
  return {
    isRegistered: SessionStore.isRegistered(),
    errors: SessionStore.getErrors()
  };
}

var Register = React.createClass({
  getInitialState: function() {
    return {
      isRegistered: SessionStore.isRegistered(),
      errors: []
    };
  },

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());    //this.state = getState();
  },

  _onSubmit: function(event) {
    event.preventDefault();   //evita il ricaricamento della pagina da parte della form
    var company = this.refs.nomeAzienda.value;
    var email = this.refs.email.value;
    var password = this.refs.password.value;
    var confirmation = this.refs.confermaPassword.value;
    if(company != "" || email != "" || password != "" || confirmation != "") {
      SessionActionCreator.signup(company, email, password, confirmation);
    } else {
      this._setError("Fill out all fields");
    }
  },

  _setError: function(error) {
    this.setState({
      isRegistered: this.state.isRegistered,
      errors: error
    });
  },

  render: function() {
    var title, content, errors;
    if(!this.state.isRegistered) {
      title = "Sign Up to MaaS";
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
      }
      content = (
        <form onSubmit={this._onSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="azienda">Company Name</label>
            <input type="text" id="azienda" ref="nomeAzienda" required />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" ref="email" required />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref="password" required />
          </div>
          <div className="form-field">
            <label htmlFor="confermaPassword">Confirm Password</label>
            <input type="password" id="confermaPassword" ref="confermaPassword" required />
          </div>
          {errors}
          <button type="submit" className="form-submit">Register your company</button>
        </form>
      );
    } else {
      title = "Thanks for your registration!";
      content = (
        <div id="successful-operation">
          <p>Now please confirm your account.</p>
          <p>Click the link we sent at: <span id="successful-email">{SessionStore.getEmail()}</span></p>
          <Link id="successful-button" className="button" to="/login">Go to Login</Link>
          <p>If you didn‘t receive your verification email <Link className="help-link" to="/verify">require another one</Link></p>
        </div>
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

module.exports = Register;