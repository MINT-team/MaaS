// Name: {ChangeCompanyName.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../../stores/UserStore.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
    isLogged: SessionStore.isLogged(),
    first: "false",
    errors: UserStore.getErrors(),
    email: UserStore.getEmail()
  };
}

var ChangeUserPersonalData = React.createClass({

  getInitialState: function() {
      return {
          accessToken: SessionStore.getAccessToken() || this.props.location.query.access_token,
          userId: this.props.params.userId,
          errors: [],
          first: "true",
          email: this.props.params.userEmail
      };
  },
    
  componentWillMount: function() {
      UserStore.addChangeListener(this._onChange);
  },
  
 componentDidMount: function() {
   this.refs.email.value = this.state.email;
 },
 
  componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

  _onSubmit: function(event) {
      event.preventDefault();   //evita il ricaricamento della pagina da parte della form
      var id = this.state.userId;
      var accessToken = this.state.accessToken;
     //fetch of the new data
      var password = this.refs.password.value;
      var confirmation = this.refs.confermaPassword.value;
      var email = this.refs.email.value;
      var confirmationEmail = this.refs.confirmEmail.value;
      
      if(password.length != 0)      //if super admin want's to change user's password
        RequestUserActionCreator.changePassword(id, password, confirmation, accessToken);
      if(email.length != 0)
      {
       RequestUserActionCreator.changeEmail(id, email, confirmationEmail, accessToken);  
      }
     
     if(password.length == 0 && email.length == 0)
        this._setError("No changes to save");
     
  },
  
  _setError: function(error) {
    this.setState({
      isRegistered: this.state.isRegistered,
      errors: this.state.errors
    });
  },

  render: function() {
	  var title, content, errors;
    if(this.state.errors.length > 0 || this.state.first == "true") 
    { 
      title = "Change user data";
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
      }
      content = (
        <form onSubmit={this._onSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref="password" />
          </div>
          <div className="form-field">
            <label htmlFor="confermaPassword">Confirm Password</label>
            <input type="password" id="confermaPassword" ref="confermaPassword" />
          </div>
          
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input type="email" ref="email" />
          </div>
          <div className="form-field">
            <label htmlFor="email">Confirm email</label>
            <input type="email" ref="confirmEmail" />
          </div>
          {errors}
          <button type="submit" className="form-submit">Save changes</button>
        </form>
      );
    } 
    else 
    {
      title = "User's data changed";
        content = (
          <div id="successful-operation">
            <p>User's data has been changed successfully.</p>
            <Link id="successful-button" className="button" to="/dashboardSuperAdmin/databaseManagement/usersManagement">Back to users management</Link>
          </div>
        );
    }
    
    return (
      <div className="container sidebar-container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
    }
});


module.exports = ChangeUserPersonalData;