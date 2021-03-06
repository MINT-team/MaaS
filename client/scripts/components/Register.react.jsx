var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore= require('../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');

function getState() {
  return {
    isRegistered: SessionStore.isRegistered() || UserStore.getEmail()? true : false,
    errors: SessionStore.getErrors(),
    inviteErrors: UserStore.getErrors()
  };
}

var Register = React.createClass({
  
  contextTypes: {
    router: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
    return {
      isLogged: SessionStore.isLogged(),
      userType:SessionStore.whoIam(),
      activeDashboard: UserStore.getActiveDashboard(),
      isRegistered: false, //SessionStore.isRegistered()|| UserStore.getEmail()? true : false,
      userId: this.props.location.query.uid,
      accessToken: this.props.location.query.access_token,
      errors: [],
      inviteErrors: []
    };
  },
  
  componentWillMount: function() {
		if(this.state.isLogged)
    	{
        	const { router } = this.context;
        	if(this.state.userType == "commonUser")
        	{
        		if (this.state.activeDashboard == "default")
        		{
            		router.push('/manageDSL');   // redirect to DSL page
        		}
        		else if (this.state.activeDashboard)
        		{
            		router.push('/manageDSL/executeDSL/'+ this.state.activeDashboard);      // redirect to Dashboard page
        		}
        	}
        	else //redirect for Super Admin
        	{
        		router.push('/dashboardSuperAdmin');   // redirect to Super Admin Dashboard page
        	}
    	}
	},

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());    //this.state = getState();
  },

  _onRegisterSubmit: function(event) {
    event.preventDefault();   //evita il ricaricamento della pagina da parte della form
    var company = this.refs.nomeAzienda.value;
    var email = this.refs.email.value;
    var password = this.refs.password.value;
    var confirmation = this.refs.confermaPassword.value;
    if(company != "" || email != "" || password != "" || confirmation != "")
    {
      RequestSessionActionCreator.signup(company, email, password, confirmation);
    }
    else
    {
      this._setError("Fill out all fields");
    }
  },

  _onInviteSubmit: function(event) {
    event.preventDefault();   //evita il ricaricamento della pagina da parte della form
    var id = this.state.userId;
    var accessToken = this.state.accessToken;
    var password = this.refs.password.value;
    var confirmation = this.refs.confermaPassword.value;
    if(password != "" || confirmation != "")
    {
      // register by invite, the user already exists, we only have to change his password
      RequestUserActionCreator.changePassword(id, password, confirmation, accessToken);
    }
    else
    {
      this._setError("Fill out all fields");
    }
  },

  _setError: function(error) {
    this.setState({
      isRegistered: this.state.isRegistered,
      errors: error,
      inviteErrors: error
    });
  },

  render: function() {
    var title, content, errors;
    if(!this.state.isRegistered)
    {
      title = "Sign Up to MaaS";
      if(this.state.userId && this.state.userId!="undefined")
      {
        if(this.state.inviteErrors.length > 0) {
          errors = (<p id="errors">{this.state.inviteErrors}</p>);
        }
        content = (
          <form onSubmit={this._onInviteSubmit} className="form-container">
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" ref="password" required />
            </div>
            <div className="form-field">
              <label htmlFor="confermaPassword">Confirm Password</label>
              <input type="password" id="confermaPassword" ref="confermaPassword" required />
            </div>
            {errors}
            <button type="submit" className="form-submit">Join your company</button>
          </form>
        );
      }
      else
      {
        if(this.state.errors.length > 0)
        {
          errors = (<p id="errors">{this.state.errors}</p>);
        }
        content = (
          <form onSubmit={this._onRegisterSubmit} className="form-container">
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
      }
    }
    else
    {
      title = "Thanks for your registration!";
      if(this.state.userId && this.state.userId!="undefined")
      {
        content = (
          <div id="successful-operation">
            <p>Now you that have confirmed your account you can log into MaaS.</p>
            <Link id="successful-button" className="button" to="/login">Go to Login</Link>
          </div>
        );
      }
      else
      {
        content = (
          <div id="successful-operation">
            <p>Now please confirm your account.</p>
            <p>Click the link we sent at: <span id="successful-email">{SessionStore.getEmail()}</span></p>
            <Link id="successful-button" className="button" to="/login">Go to Login</Link>
          </div>
        ); //<p>If you didn‘t receive your verification email <Link className="help-link" to="/verify">require another one</Link></p>
      }
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