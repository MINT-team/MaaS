// Name: {People.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var Invite = require('./Invite.react.jsx');
var DeleteUser = require('./DeleteUser.react.jsx');

function getState() {
  return {
          id: CompanyStore.getId(),
          name: CompanyStore.getName(),
          errors: CompanyStore.getErrors(),
          isLogged: SessionStore.isLogged(),
          role: UserStore.getRole()
      };
}

var People = React.createClass({

  getInitialState: function() {
      return getState();
  },

  componentDidMount: function() {
      SessionStore.addChangeListener(this._onChange);
      CompanyStore.addChangeListener(this._onChange);
      UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

    // click sull'utente per vedere il profilo?
//   _onSubmit: function(event) {
//       event.preventDefault();   //evita il ricaricamento della pagina da parte della form
//       var password = this.refs.password.value;
//       var confirmation = this.refs.confermaPassword.value;
//       var id = this.state.userId;
//       var accessToken = this.state.accessToken;
//       UserActionCreator.changePassword(id, password, confirmation, accessToken);
//   },

  isLowerGrade: function(role) {
      var myRole = this.state.role;
      if(myRole == "Owner") {
        if(role == "Owner")
          return false;
        else
          return true;
      }
      if(myRole == "Administrator") {
        if(role == "Owner" || role == "Administrator")
          return false;
        else
          return true;
      }
  },

  render: function() {

    if(!this.state.isLogged || this.state.errors.length > 0 || !this.props.users) {
        return (
            <div className="container">
              <p className="container-title">Authorization required</p>
              <p className="container-description">You are not authorized to view this page</p>
              <Link to="/" className="button">Back to home</Link>
            </div>
        );
    }

    var title, content;
    if(this.props.users.length > 1) {
        title = "Users of your Company";
                    // Avatar, nome, cognome, ruolo, email
        if(this.state.role == "Owner" || this.state.role == "Administrator") {
          content = (
            <div className="table-content">
                <div className="table-header">
                    <span className="table-column-small"></span>
                    <span className="table-column-normal">Name</span>
                    <span className="table-column-normal">Surname</span>
                    <span className="table-column-normal">Role</span>
                    <span className="table-column-big">Email</span>
                    <span className="table-spacing"></span>
                </div>
                {this.props.users.map((u) =>
                  <div className="table-row">
          					<span className="table-column-small">
          					  {u.avatar?
          					    (<img src={"../../../images/"+u.avatar} />) :
          					    (<i className="material-icons md-36 table-row-icon">&#xE851;</i>)}
          					</span>
          					<span className="table-column-normal">{u.name}</span>
          					<span className="table-column-normal">{u.surname}</span>
          					<span className="table-column-normal">{u.role}</span>
          					<span className="table-column-big">{u.email}</span>
          					{this.isLowerGrade(u.role) ? <DeleteUser email={u.email} /> : <span className="table-spacing"></span>}
          				</div>
      			    )}
			          <Invite />
            </div>
          );
        } else {
          content = (
            <div className="table-content">
                <div className="table-header">
                    <p className="table-column-small"></p>
                    <span className="table-column-normal">Name</span>
                    <span className="table-column-normal">Surname</span>
                    <span className="table-column-normal">Role</span>
                    <span className="table-column-big">Email</span>
                </div>
                {this.props.users.map((u) =>
                  <div className="table-row">
          					<span className="table-column-small">
          					  {u.avatar?
          					    (<img src={"../../../images/"+u.avatar} />) :
          					    (<i className="material-icons md-36 table-row-icon">&#xE851;</i>)}
          					</span>
          					<span className="table-column-normal">{u.name}</span>
          					<span className="table-column-normal">{u.surname}</span>
          					<span className="table-column-normal">{u.role}</span>
          					<span className="table-column-big">{u.email}</span>
          				</div>
      			    )}
            </div>
          );
        }
        
    } else {
        title = "Invite someone to your company";
        content = (
            <div id="successful-operation">
                <p>You created your company, now it's time to invite someone to collaborate in your work.</p>
                <p>Choose the role and insert the email to send the invitation</p>
                <Invite />
                <ul id="role-explaination">
                  <li>
                    <span className="role">Administrator:</span>
                    <span className="role-description">can execute all operation like you.</span>
                  </li>
                  <li>
                    <span className="role">Member:</span>
                    <span className="role-description">is possible to select wich operation are allowed.</span>
                  </li>
                  <li>
                    <span className="role">Guest:</span>
                    <span className="role-description">can only read some information.</span>
                  </li>
                </ul>
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

module.exports = People;