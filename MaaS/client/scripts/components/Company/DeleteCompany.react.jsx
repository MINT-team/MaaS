// Name: {DeleteAccount.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Profile/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');

function getState() {
  return {
    companyId: CompanyStore.getId(),
    email:  UserStore.getUser().email,
    errors: UserStore.getErrors()
  };
}

var DeleteCompany = React.createClass({

   getInitialState: function() {
       return {
            companyId: CompanyStore.getId(),
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

   deleteCompany: function(event) {
       event.preventDefault();
       var id = this.state.companyId;
       var email = this.state.email;
       RequestCompanyActionCreator.deleteCompany(id, email);
   },

  render: function() {
     var title, content, errors;
     if(!this.state.errors.length > 0) {
       title = "Delete your company";
       if(this.state.errors.length > 0) {
         errors = (
           <p id="errors">{this.state.errors}</p>
         );
       }
       content = (
            <div id="successful-operation">
             <p>Are you sure you want to remove your company?</p>
             <p>All users collaborating and all DSL defined in it will be lost</p>
             <Link className="button" to="/company">No</Link>
             <Link id="delete-button" className="button" onClick={this.deleteCompany} to="/">Delete my company</Link>
           </div>
       );

     } else {
    //   if(this.props.location.pathname == "/profile/changePassword") { // change password by logged profile
    //      title = "Password changed";
    //      content = (
    //       <div id="successful-operation">
    //          <p>Your password has been changed successfully.</p>
    //          <Link id="successful-button" className="button" to="/profile">Back to your profile</Link>
    //       </div>
    //      );
    //   } else if(this.props.location.pathname == "/recoverpwd") {  // change password by reset password
    //      title = "Password changed successfully!";
    //      content = (
    //       <div id="successful-operation">
    //          <p>You changed your password, now you can log into MaaS.</p>
    //          <Link id="successful-button" className="button" to="/login">Go to Login</Link>
    //       </div>
    //      );
    //   }
     }
     return (
       <div className="container">
         <p className="container-title">{title}</p>
         {content}
       </div>
     );
  }
});

module.exports = DeleteCompany;