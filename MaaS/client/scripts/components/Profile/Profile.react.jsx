var React = require('react');
var Sidebar = require('../Sidebar.react.jsx');


var Profile = React.createClass({
    render: function() {
      var content;
      if(this.props.children) {
        content = this.props.children;
      } else {
        content = (
          <div className="container">
            <p className="container-title">Mario Rossi</p>
            <p className="container-description">
              <i id="left-arrow" className="material-icons md-48">&#xE5CB;</i>
              Seleziona sulla sinistra i dati che vuoi modificare
            </p>
          </div>
        );
      }

      //Inizializzo la SideBar
      var avatar = {
        label: "Avatar",
        link: "/profile/changeAvatar",
        icon: (<i className="material-icons md-24">&#xE43B;</i>)
      };
      var dati = {
        label: "Dati anagrafici",
        link: "/profile/personalData",
        icon: (<i className="material-icons md-24">&#xE853;</i>)
      };
      var password = {
        label: "Password",
        link: "/profile/changePassword",
        icon: (<i className="material-icons md-24">&#xE897;</i>)
      };
      var sidebarData = [avatar, dati, password];

      return (
        <div id="profile-settings">
          <Sidebar title="Impostazioni profilo" data={sidebarData}/>
          {content}
        </div>
      );
    }
});

module.exports = Profile;