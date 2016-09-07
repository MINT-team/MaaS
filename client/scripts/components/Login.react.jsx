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
var SuperAdminStore = require('../stores/SuperAdminStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
    isLogged: SessionStore.isLogged(),
    userType:SessionStore.whoIam(),
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
      UserStore.addUserLoadListener(this._onUserLoad);
      SuperAdminStore.addLoginSAListener(this._onUserLoad);

    },

    componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      UserStore.removeUserLoadListener(this._onUserLoad);
      SuperAdminStore.removeLoginSAListener(this._onUserLoad);
    },
    
    handleRedirect: function() {
      if(this.state.isLogged)
      {
        if(this.state.userType == "commonUser")
        {
          const { router } = this.context;
          if (this.state.activeDashboard == "default")
          {
            router.push('/manageDSL');   // redirect to DSL page
          }
          else if (this.state.activeDashboard)
          {
            router.push('/manageDSL/executeDSL/'+this.state.activeDashboard);      // redirect to Dashboard page
          }
        }else //redirect for Super Admin
        {
          const { router } = this.context;
          router.push('/dashboardSuperAdmin');   // redirect to Super Admin Dashboard page
        }
    }
    },

    _onChange: function() {
      this.setState(getState());
      if(this.state.isLogged)
      {
          if(this.state.userType == "commonUser")
          {
            // loads data to the session
              RequestUserActionCreator.getUser(SessionStore.getUserId());
              RequestUserActionCreator.getCompany(SessionStore.getUserId());
              RequestUserActionCreator.getEditorConfig(SessionStore.getUserId());
          }
      }
    },
    
    _onUserLoad: function() {
      this.setState({ activeDashboard: UserStore.getActiveDashboard() });
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