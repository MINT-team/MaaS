// Name: {Company.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');

function getState() {
  return {
          id: CompanyStore.getId(),
          name: CompanyStore.getName(),
          users: CompanyStore.getUsers(),
          errors: CompanyStore.getErrors(),
          isLogged: SessionStore.isLogged(),
          role: UserStore.getRole(),
          databasesCount: CompanyStore.getDatabasesCount(),
          DSLDefinitionsCount: CompanyStore.getDSLDefinitionCount()
      };
}

var Company = React.createClass({

  getInitialState: function() {
      return {
          id: CompanyStore.getId(),
          name: CompanyStore.getName(),
          users: CompanyStore.getUsers(),
          errors: [],
          isLogged: SessionStore.isLogged(),
          role: UserStore.getRole()
      };
  },
  
  componentWillMount: function() {
    SessionStore.addChangeListener(this._onChange);
    CompanyStore.addChangeListener(this._onChange);
    RequestCompanyActionCreator.getUsers(this.state.id);
    RequestCompanyActionCreator.getDatabasesCount(this.state.id);
    RequestCompanyActionCreator.getDSLDefinitionsCount(this.state.id);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
    CompanyStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(getState());
  },

  render: function() {
    if(this.state.errors.length > 0) {
        return (
            <div className="container">
              <p className="container-title">Authorization required</p>
              <p className="container-description">You are not authorized to view this page</p>
              <Link to="/" className="button">Back to home</Link>
            </div>
        );
    }

    var content;
    if(this.props.children)
    {
      // users prop to children
      const childrenWithUsers = React.Children.map(this.props.children,
        (child) => React.cloneElement(child, {
          users: this.state.users
        })
      );
      content = childrenWithUsers;
    }
    else
    {
      var name = this.state.name;
      var numberOfUsers = this.state.users.length;
      var numberOfDatabases = this.state.databasesCount;
      var numberOfDSL = this.state.DSLDefinitionsCount;
      content = (
        <div className="container sidebar-container">
          <p className="container-title">{name}</p>
          <div id="company-counter" className="form-container">
            <div className="form-field">
              <label>Users:</label>
              <p>{numberOfUsers>0? numberOfUsers : 'Loading...'}</p>
            </div>
            <div className="form-field">
              <label>Databases:</label>
              <p>{numberOfDatabases>=0? numberOfDatabases : 'Loading...'}</p>
            </div>
            <div className="form-field">
              <label>DSL definitions:</label>
              <p>{numberOfDSL>=0? numberOfDSL : 'Loading...'}</p>
            </div>
          </div>
        </div>
      );
    }

    // SideBar initialization

    // dash: <i class="material-icons">&#xE871;</i> / <i class="material-icons">&#xE8F1;</i> / <i class="material-icons">&#xE1BD;</i> / <i class="material-icons">&#xE42B;</i>
// coll: <i class="material-icons">list</i>
// doc: <i class="material-icons">&#xE873;</i>
// cell: <i class="material-icons">&#xE06F;</i> / <i class="material-icons">&#xE3BC;</i>

    var database = {
      label: "Database",
      link: "/externalDatabases",
      icon: (<i className="material-icons md-24">&#xE1DB;</i>)
    };
    var people = {
      label: "People",
      link: "/company/people",
      icon: (<i className="material-icons md-24">&#xE7FB;</i>)
    };
    var dsl = {
      label: "DSL",
      link: "/manageDSL",
      icon: (<i className="material-icons md-24">&#xE1B2;</i>)
    };
    var deleteCompany = {
      label: "Delete company",
      link: "/company/deleteCompany",
      icon: (<i className="material-icons md-24">&#xE5C9;</i>)
    };
    var sidebarData;
    if(this.state.role == "Owner") {
      sidebarData = [database, people, dsl, deleteCompany];
    } else {
      sidebarData = [database, people, dsl];
    }

    return (
      <div id="company">
        <Sidebar title="Company" titleLink="/company" data={sidebarData}/>
        {content}
      </div>
    );
  }
});

module.exports = Company;