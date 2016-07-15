var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');

var Company = React.createClass({

// <i class="material-icons">&#xE1DB;</i>
// <i class="material-icons">&#xE1B2;</i>

// people: <i class="material-icons">&#xE7FB;</i>

// dash: <i class="material-icons">&#xE871;</i> / <i class="material-icons">&#xE8F1;</i> / <i class="material-icons">&#xE1BD;</i> / <i class="material-icons">&#xE42B;</i>
// coll: <i class="material-icons">list</i>
// doc: <i class="material-icons">&#xE873;</i>
// cell: <i class="material-icons">&#xE06F;</i> / <i class="material-icons">&#xE3BC;</i>


  render: function() {

    var content;
    if(this.props.children) {
      // render user settings once sidebar is clicked
      content = this.props.children;
    } else {
      var name = this.state.name;
      content = (
        <div className="container">
          <p className="container-title">{name}</p>
          <img id="avatar" src="" />
          <div className="form-container">
            <div className="form-field">
              <label>:</label>
              <p>{this.state.email}</p>
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
    var database = {
      label: "Database",
      link: "/company/database",
      icon: (<i className="material-icons md-24">&#xE1DB;</i>)
    };
    var people = {
      label: "People",
      link: "/profile/people",
      icon: (<i className="material-icons md-24">&#xE7FB;</i>)
    };
    var dsl = {
      label: "DSL",
      link: "/profile/dsl",
      icon: (<i className="material-icons md-24">&#xE1B2;</i>)
    };
    var sidebarData = [database, people, dsl];

    return (
      <div id="profile-settings">
        <Sidebar title="Company" titleLink="/profile" data={sidebarData}/>
        {content}
      </div>
    );
  }
});

module.exports = Company;