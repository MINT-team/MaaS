// Name: {DeleteAccount.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Profile/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');

function getState() {
  return {
    userId: UserStore.getId(),
    email:  UserStore.getUser().email,
    errors: UserStore.getErrors()
  };
}

var DeleteAccount = React.createClass({

   getInitialState: function() {
       return {
            userId: UserStore.getId(),
            email:  UserStore.getUser().email,
            errors: []
       };
   },

   componentDidMount: function() {
       CompanyStore.addChangeListener(this._onChange);
   },

   componentWillUnmount: function() {
       CompanyStore.removeChangeListener(this._onChange);
   },

   _onChange: function() {
       this.setState(getState());
   },

   deleteAccount: function(event) {
       var id = this.state.userId;
       var email = this.state.email;
       alert("del");
       RequestUserActionCreator.deleteUser(email, id);
       // logout
       var accessToken = SessionStore.getAccessToken();
		   RequestSessionActionCreator.logout(accessToken);
   },

  render: function() {
     var title, content, errors;
     if(!this.state.errors.length > 0) {
       title = "Delete your account";
       if(this.state.errors.length > 0) {
         errors = (
           <p id="errors">{this.state.errors}</p>
         );
       }
       content = (
            <div id="successful-operation">
             <p>Are you sure you want to remove your account from this company?</p>
             <Link className="button" to="/company">No</Link>
             <Link id="delete-button" className="button" onClick={this.deleteAccount} to="/">Delete my account</Link>
           </div>
       );

     } else {
       
     }
     return (
       <div className="container">
         <p className="container-title">{title}</p>
         {content}
       </div>
     );
  }
});

module.exports = DeleteAccount;