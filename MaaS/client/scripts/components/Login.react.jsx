var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var SessionActionCreator = require('../actions/SessionActionCreator.react.jsx');
var UserActionCreator = require('../actions/UserActionCreator.react.jsx');

function getState() {
  return {
    isLogged: SessionStore.isLogged(),
    errors: SessionStore.getErrors()
  };
}

var Login = React.createClass({

    contextTypes: {   // serve per utilizzare il router
      router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        isLogged: SessionStore.isLogged(),
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
      this.setState(getState());
      if(this.state.isLogged) {
        const { router } = this.context;
        router.push('/');   // redirect to home page
      }
    },

    _onSubmit: function(e) {
      e.preventDefault();
      var email = this.refs.email.value;
      var password = this.refs.password.value;
      if(email != "" && password != "")
        SessionActionCreator.login(email, password);
      else
        this._setError("Fill out all fields");
    },

    _setError: function(error) {
      this.setState({
        isLogged: this.state.isLogged,
        errors: error
      });
    },

    render() {
      var errors, help;
      help = (
        <p id="login-help">Forgot your password? <Link className="help-link" to="/resetpwd">Choose a new one</Link></p>
      );
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
        if(this.state.errors.match(/verify your email/))
          help = "";  // la password e' giusta, non serve l'aiuto
      }
      return (
        <div className="container">
          <p className="container-title">Login to MaaS</p>
          <form onSubmit={this._onSubmit}>
            <div className="form-vertical-block">
              <label htmlFor="email"><i className="material-icons md-24 input-icon">&#xE853;</i></label>
              <input type="text" id="email" ref="email" placeholder="Email" className="iconized-input" required/>
            </div>
            <div className="form-vertical-block">
              <label htmlFor="password"><i className="material-icons md-24 input-icon">&#xE897;</i></label>
              <input type="password" id="password" ref="password" placeholder="Password" className="iconized-input" required/>
              {errors}
              {help}
            </div>
            <button type="submit" className="form-submit">Login</button>
          </form>
        </div>
    );
    }
});

module.exports = Login;