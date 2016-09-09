var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
    email: UserStore.getUser().email,
    errors: UserStore.getErrors()
  };
}

var ResetPwd = React.createClass({
    getInitialState: function() {
        return {
            email: UserStore.getUser().email,
            errors: []
        };
    },

    componentDidMount: function() {
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
        var email = this.refs.email.value;
        if(email != "") {
            RequestUserActionCreator.resetPassword(email);
        } else {
          this._setError("Fill out email field");
        }
    },

    _setError: function(error) {
        this.setState({
          email: this.state.email,
          errors: error
        });
    },

    render: function() {
        var title, content, errors;
        if(!this.state.email) {
          title = "Request to change your password";
          if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
          }
          content = (
            <div id="reset-password">
                <p>Give us the email you used for registration.</p>
                <p>We'll send you a verification link to change your password.</p>
                <form onSubmit={this._onSubmit} className="form-container" >
                    <div className="form-field">
                        <label htmlFor="email">Registered email</label>
                        <input type="text" id="email" placeholder="Email" ref="email" required />
                    </div>
                    {errors}
                    <button type="submit" className="form-submit">Request</button>
                </form>
            </div>
          );
        } else {
          title = "Request sent!";
          content = (
            <div id="successful-operation">
              <p>Now please confirm your request.</p>
              <p>Click the link we sent at: <span id="successful-email">{this.state.email}</span></p>
              <div id="successful-button"></div>
            </div>
          );
          //<p>If you didn‘t receive your password reset email <Link className="help-link" to="/verify">require another one</Link></p>
        }
        return (
          <div className="container">
            <p className="container-title">{title}</p>
            {content}
          </div>
        );
    }
});

module.exports = ResetPwd;