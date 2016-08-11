// Name: {Login.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
    isLogged: SessionStore.isLogged(),
    userType:SessionStore.whoIam(),
    errors: SessionStore.getErrors(),
    activeDashboard: UserStore.getActiveDashboard()
  };
}

var Login = React.createClass({

    contextTypes: {   // serve per utilizzare il router
      router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
      return {
        isLogged: SessionStore.isLogged(),
        errors: [],
        activeDashboard: []
      };
    },

    componentDidMount: function() {
      SessionStore.addChangeListener(this._onChange);
      this.handleRedirect();
    },

    componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
    },
    
    handleRedirect: function() {
      if(this.state.isLogged)
      {
        const { router } = this.context;
        
        if (this.state.activeDashboard == "default")
        {
          router.push('/manageDSL');   // redirect to Dashboard page
        }
        else
        {
          //Redirect to active dashboard
        }
        
        //router.push('/');
      }
    },

    _onChange: function() {
      this.setState(getState());
      if(this.state.isLogged) {                                         // loads data to the session
            RequestUserActionCreator.getUser(SessionStore.getUserId());
            if(this.state.userType == "commonUser")
            {                   
                RequestUserActionCreator.getCompany(SessionStore.getUserId());
                RequestUserActionCreator.getEditorConfig(SessionStore.getUserId());
            }
      }
      this.handleRedirect();
    },

    _onSubmit: function(e) {
      e.preventDefault();
      var email = this.refs.email.value;
      var password = this.refs.password.value;
      if(email != "" && password != "")
        RequestSessionActionCreator.login(email, password);
      else
        this._setError("Fill out all fields");
    },

    _setError: function(error) {
      this.setState({
        isLogged: this.state.isLogged,
        errors: error
      });
    },

    render: function() {
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
              <input type="text" id="email" ref="email" placeholder="Email" className="iconized-input login-input" required/>
            </div>
            <div className="form-vertical-block">
              <label htmlFor="password"><i className="material-icons md-24 input-icon">&#xE897;</i></label>
              <input type="password" id="password" ref="password" placeholder="Password" className="iconized-input login-input" required/>
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