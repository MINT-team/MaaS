var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');

function getState() {
  return {
          name: CompanyStore.getName()
      };
}

var Company = React.createClass({

// <i class="material-icons">&#xE1DB;</i>
// <i class="material-icons">&#xE1B2;</i>

// people: <i class="material-icons">&#xE7FB;</i>

// dash: <i class="material-icons">&#xE871;</i> / <i class="material-icons">&#xE8F1;</i> / <i class="material-icons">&#xE1BD;</i> / <i class="material-icons">&#xE42B;</i>
// coll: <i class="material-icons">list</i>
// doc: <i class="material-icons">&#xE873;</i>
// cell: <i class="material-icons">&#xE06F;</i> / <i class="material-icons">&#xE3BC;</i>

  getInitialState: function() {
      return getState();
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

  render: function() {
    var content;
    if(this.props.children) {
      content = this.props.children;
    } else {
      var name = this.state.name;
      content = (
        <div className="container">
          <p className="container-title">{name}</p>
          <div className="form-container">
            <div className="form-field">
              <label></label>
              <p></p>
            </div>
          </div>
        </div>
      );
    }

    // SideBar initialization
    var database = {
      label: "Database",
      link: "/company/database",
      icon: (<i className="material-icons md-24">&#xE1DB;</i>)
    };
    var people = {
      label: "People",
      link: "/company/people",
      icon: (<i className="material-icons md-24">&#xE7FB;</i>)
    };
    var dsl = {
      label: "DSL",
      link: "/company/dsl",
      icon: (<i className="material-icons md-24">&#xE1B2;</i>)
    };
    var sidebarData = [database, people, dsl];

    return (
      <div id="profile-settings">
        <Sidebar title="Company" titleLink="/company" data={sidebarData}/>
        {content}
      </div>
    );
  }
});

module.exports = Company;