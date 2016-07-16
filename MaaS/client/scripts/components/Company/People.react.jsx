var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var CompanyActionCreator = require('../../actions/CompanyActionCreator.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var UserActionCreator = require('../../actions/UserActionCreator.react.jsx');
var Invite = require('./Invite.react.jsx');

function getState() {
  return {
          id: CompanyStore.getId(),
          name: CompanyStore.getName(),
          errors: CompanyStore.getErrors(),
          isLogged: SessionStore.isLogged()
      };
}

var People = React.createClass({

  getInitialState: function() {
      return getState();
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

    var title, content, avatar;
    if(!(this.props.users.length > 1)) {
        title = "Users of your Company";
                    // Avatar, nome, cognome, ruolo, email
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
          					<span className="table-column-small">{u.avatar? (<img src={"../../../images/"+u.avatar} />) : (<i className="material-icons md-36">&#xE851;</i>)}</span>
          					<span className="table-column-normal">{u.name}</span>
          					<span className="table-column-normal">{u.surname}</span>
          					<span className="table-column-normal">{u.role}</span>
          					<span className="table-column-big">{u.email}</span>
          				</div>
      			    )}
			          <Invite />
            </div>
        );
    } else {
        title = "Invite someone to your company";
        content = (
            <div id="successful-operation">
                <p>You created your company, now it's time to invite someone to collaborate in your work.</p>
                <Invite />
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