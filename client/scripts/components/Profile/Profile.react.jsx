var React = require('react');
var Sidebar = require('../Sidebar.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
          name: UserStore.getName(),
          surname: UserStore.getSurname(),
          role: UserStore.getRole(),
          email: UserStore.getEmail(),
          dateOfBirth: UserStore.getDateOfBirth(),
          gender: UserStore.getGender(),
          avatar: UserStore.getAvatar()
      };
}

var Profile = React.createClass({
  getInitialState: function() {
      var state = getState();
      state.user = null;
      return state;
  },
  
  componentWillMount: function() {
    if (this.props.params.userId && !this.props.users)
    {
      RequestUserActionCreator.getUser(this.props.params.userId);
    }
  },

  componentDidMount: function() {
      UserStore.addChangeListener(this._onChange);
      UserStore.addUserLoadListener(this._onUserLoad);
  },

  componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
      UserStore.removeUserLoadListener(this._onUserLoad);
  },

  _onChange: function() {
      this.setState(getState());
  },
  
  _onUserLoad: function() {
    this.setState({user: UserStore.getUser()});
  },

  render: function() {
    var content;
    if(this.props.children) 
    {
      // render user settings once sidebar is clicked
      content = this.props.children;
    }
    else
    {
      if(this.props.params.userId)
      {
        var user = null;
        if(this.props.users)
        {
          for(var i = 0; !user && i<this.props.users.length; i++  )
          {
            if(this.props.users[i].id == this.props.params.userId)
              user = this.props.users[i];
          }
        }
        else
        {
          user = this.state.user;
        }
        if(user)
        {
          var name, dateOfBirth, gender, avatar = this.state.avatar;
          if((!user.name && !user.surname))
          {
            name = user.email;
          }
          else 
          {
            if(user.name && user.surname)
            {
              name = user.name + ' ' + user.surname;
            }
            else
            {
              if(user.name)
              {
                name = user.name;
              }
              else if(user.surname)
              {
                name = user.surname;
              }
            }
          }
          
          user.dateOfBirth = new Date(user.dateOfBirth);
          if(!user.dateOfBirth || user.dateOfBirth.toDateString().match(/Invalid/))
          {
            dateOfBirth = "Not set";
          }
          else
          {
            dateOfBirth = user.dateOfBirth.toDateString();
          }
          if(!user.gender || user.gender=="undefined")
          {
            gender = "Not set";
          }
          else if(user.gender == "male")
          {
            gender = "Male";
          }
          else if(user.gender == "female")
          {
            gender = "Female";
          }
          else
          {
            gender = user.gender;
          }
          if(!user.avatar || user.avatar=="undefined")
          {
            avatar = (<i id="avatar-i" className="material-icons">&#xE851;</i>);
          }
          else
          {
            console.log(user.avatar);
            console.log(user.avatar.preview);
            
            /*
            
            [Object]0: Object
              preview: "blob:http://maas-navid94.c9users.io:8080/2be79dd3-f975-4804-8087-323513dbd6db"
              __proto__: Object
              length: 1__proto__: Array[0]
            app.js:7056 undefined
            */
            avatar = (<img id="avatar" src={user.avatar.preview} />);  // da cambiare col servizio esterno
          }
          content = (
            <div className="container sidebar-container">
              <p className="container-title">{name}</p>
              {avatar}
              <div className="form-container">
                <div className="form-field">
                  <label>Role:</label>
                  <p>{user.role}</p>
                </div>
                <div className="form-field">
                  <label>Email:</label>
                  <p>{user.email}</p>
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
        }
        else
        {
          content = (
            <div className="container sidebar-container">
              <p className="container-title">User not found</p>
            </div>
          );
        }
      }
      else
      {
        var name, dateOfBirth, gender, avatar = this.state.avatar;
        if((!this.state.name && !this.state.surname))
        {
          name = "Complete your account here";
        }
        else
        {
          name = this.state.name + ' ' + this.state.surname;
        }
        if(!this.state.dateOfBirth || this.state.dateOfBirth.toDateString().match(/Invalid/))
        {
          dateOfBirth = "Not set";
        }
        else
        {
          dateOfBirth = this.state.dateOfBirth.toDateString();
        }
        if(!this.state.gender || this.state.gender=="undefined")
        {
          gender = "Not set";
        }
        else if(this.state.gender == "male")
        {
          gender = "Male";
        }
        else if(this.state.gender == "female")
        {
          gender = "Female";
        } 
        else
        {
          gender = this.state.gender;
        }
        if(!this.state.avatar || this.state.avatar=="undefined")
        {
          avatar = (<i id="avatar-i" className="material-icons">&#xE851;</i>);
        }
        else
        {
          avatar = (<img id="avatar" src={"../../../images/"+this.state.avatar} />);  // da cambiare col servizio esterno
        }
        content = (
          <div className="container sidebar-container">
            <p className="container-title">{name}</p>
            {avatar}
            <div className="form-container">
              <div className="form-field">
                <label>Role:</label>
                <p>{this.state.role}</p>
              </div>
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

    if(this.props.params.userId)
    {
      return (
        <div id="profile">
          {content}
        </div>
      );
    }
    else
    {
      return (
        <div id="profile-settings">
          <Sidebar title="Profile" titleLink="/profile" data={sidebarData}/>
          {content}
        </div>
      );
    }
    
  }
});

module.exports = Profile;