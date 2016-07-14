var React = require('react');
var Sidebar = require('../Sidebar.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');

function getState() {
  return {
          name: UserStore.getName(),
          surname: UserStore.getSurname(),
          email: UserStore.getEmail(),
          dateOfBirth: UserStore.getDateOfBirth(),
          gender: UserStore.getGender(),
          //avatar: UserStore.getAvatar()   // TO DO
      };
}

var Profile = React.createClass({
  getInitialState: function() {
      return getState();
  },

  componentDidMount: function() {
      UserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

  render: function() {
    var content;
    if(this.props.children) {
      // render user settings once sidebar is clicked
      content = this.props.children;
    } else {
      var name, dateOfBirth, gender;
      if((!this.state.name && !this.state.surname)) {
        name = "Complete your account here";
      } else {
        name = this.state.name + ' ' + this.state.surname;
      }
      if(!this.state.dateOfBirth || this.state.dateOfBirth.toDateString().match(/Invalid/)) {
        dateOfBirth = "Not set";
      } else {
        dateOfBirth = this.state.dateOfBirth.toDateString();
      }
      if(!this.state.gender || this.state.gender=="undefined") {
        gender = "Not set";
      } else if(this.state.gender == "male"){
        gender = "Male";
      } else if(this.state.gender == "female"){
        gender = "Female";
      } else {
        gender = this.state.gender;
      }
      content = (
        <div className="container">
          <p className="container-title">{name}</p>
          <img id="avatar" src="" />
          <div className="form-container">
            <div className="form-field">
              <label>Email:</label>
              <p>{this.state.email}</p>
            </div>
            <div className="form-field">
              <label>Date of birth:</label>
              <p>{dateOfBirth}</p>
            </div>
            <div className="form-field">
              <label>Gender:</label>
              <p>{gender}</p>
            </div>
          </div>
        </div>
      );
      /*<p className="container-description">
            <i id="left-arrow" className="material-icons md-48">&#xE5CB;</i>
            Seleziona sulla sinistra i dati che vuoi modificare
          </p>*/
    }

    // SideBar initialization
    var avatar = {
      label: "Avatar",
      link: "/profile/changeAvatar",
      icon: (<i className="material-icons md-24">&#xE43B;</i>)
    };
    var personalData = {
      label: "Personal data",
      link: "/profile/personalData",
      icon: (<i className="material-icons md-24">&#xE853;</i>)
    };
    var password = {
      label: "Password",
      link: "/profile/changePassword",
      icon: (<i className="material-icons md-24">&#xE897;</i>)
    };
    var deleteAccount = {
      label: "Delete account",
      link: "/profile/deleteAccount",
      icon: (<i className="material-icons md-24">&#xE5C9;</i>)
    };
    var sidebarData = [avatar, personalData, password, deleteAccount];

    return (
      <div id="profile-settings">
        <Sidebar title="Profile" titleLink="/profile" data={sidebarData}/>
        {content}
      </div>
    );
  }
});

module.exports = Profile;