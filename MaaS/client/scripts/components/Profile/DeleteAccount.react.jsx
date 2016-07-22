// Name: {DeleteAccount.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Profile/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

// function getState() {
//   return {
//     //accessToken: RecoverPwd.getState().accessToken,
//     //userId: RecoverPwd.getState().userId,
//     email:  UserStore.getUser().email,
//     errors: UserStore.getErrors()
//   };
// }

var DeleteAccount = React.createClass({

  // getInitialState: function() {
  //     return {
  //         accessToken: sessionStorage.getItem('accessToken') || this.props.location.query.access_token,
  //         userId: sessionStorage.getItem('userId') || this.props.location.query.uid,
  //         email: null,
  //         errors: []
  //     };
  // },

  // componentDidMount: function() {
  //     UserStore.addChangeListener(this._onChange);
  // },

  // componentWillUnmount: function() {
  //     UserStore.removeChangeListener(this._onChange);
  // },

  // _onChange: function() {
  //     this.setState(getState());
  // },

  // _onSubmit: function(event) {
  //     event.preventDefault();   //evita il ricaricamento della pagina da parte della form
  //     var password = this.refs.password.value;
  //     var confirmation = this.refs.confermaPassword.value;
  //     var id = this.state.userId;
  //     var accessToken = this.state.accessToken;
  //     RequestUserActionCreator.changePassword(id, password, confirmation, accessToken);
  // },

  render: function() {
  //   var title, content, errors;
  //   if(!this.state.email || this.state.errors.length > 0) { // in questo caso l'email serve solo per controllo
  //     title = "Choose a new password";
  //     if(this.state.errors.length > 0) {
  //       errors = (
  //         <p id="errors">{this.state.errors}</p>
  //       );
  //     }
  //     content = (
  //       <form onSubmit={this._onSubmit} className="form-container">
  //         <div className="form-field">
  //           <label htmlFor="password">Password</label>
  //           <input type="password" id="password" ref="password" required/>
  //         </div>
  //         <div className="form-field">
  //           <label htmlFor="confermaPassword">Confirm Password</label>
  //           <input type="password" id="confermaPassword" ref="confermaPassword" required/>
  //         </div>
  //         {errors}
  //         <button type="submit" className="form-submit">Set password</button>
  //       </form>
  //     );

  //   } else {
  //     if(this.props.location.pathname == "/profile/changePassword") { // change password by logged profile
  //       title = "Password changed";
  //       content = (
  //         <div id="successful-operation">
  //           <p>Your password has been changed successfully.</p>
  //           <Link id="successful-button" className="button" to="/profile">Back to your profile</Link>
  //         </div>
  //       );
  //     } else if(this.props.location.pathname == "/recoverpwd") {  // change password by reset password
  //       title = "Password changed successfully!";
  //       content = (
  //         <div id="successful-operation">
  //           <p>You changed your password, now you can log into MaaS.</p>
  //           <Link id="successful-button" className="button" to="/login">Go to Login</Link>
  //         </div>
  //       );
  //     }
  //   }
  //   return (
  //     <div className="container">
  //       <p className="container-title">{title}</p>
  //       {content}
  //     </div>
  //   );
  }
});

module.exports = DeleteAccount;