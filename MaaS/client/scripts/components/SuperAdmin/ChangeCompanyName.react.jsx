// Name: {ChangeCompanyName.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestSuperAdminActionCreator = require('../../actions/Request/RequestSuperAdminActionCreator.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var SuperAdminStore = require('../../stores/SuperAdminStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var Link = require('react-router').Link;

function getState(){
    return{
      name: CompanyStore.getName(),
      errors: CompanyStore.getErrors(),
      isLogged: SessionStore.isLogged(),
      first: "false"
    };
}


var ChangeCompanyName = React.createClass({
  
  getInitialState: function(){
    return{
        name: this.props.params.companyName,
        companyId: this.props.params.companyId,
        first: "true",
        errors: []
    };
  },
  
  componentDidMount: function() {
      SuperAdminStore.addChangeListener(this._onChange);
      CompanyStore.addChangeListener(this._onChange);
      this.refs.nome.value = this.state.name;
  },
  
  componentWillUnmount: function() {
      SuperAdminStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
  },
  
  _onChange: function() {
      this.setState(getState());
  },
  
  _onSubmit: function(event) {
      event.preventDefault();   
      var name = this.refs.nome.value;
      var id = this.state.companyId;
      if(name != this.state.name)
        RequestCompanyActionCreator.changeCompanyName(id, name);
      else 
        this._setError("No changes to save");
    
  },
  
  _setError: function(error) {
    this.setState({
      isRegistered: this.state.isRegistered,
      errors: error
    });
  },
  
	 render: function() {
	  var title, content, errors;
    if(this.state.errors.length > 0 || this.state.first == "true") 
    { 
      title = "Change company name";
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
      }
      content = (
        <form onSubmit={this._onSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="nome">Name</label>
            <input type="text" id="nome" ref="nome" />
          </div>
          {errors}
          <button type="submit" className="form-submit">Save changes</button>
        </form>
      );
    } 
    else 
    {
      title = "Company name changed";
      content = (
        <div id="successful-operation">
          <p>The name of the company has been changed successfully.</p>
          <Link className="button" to="dashboardSuperAdmin/databaseManagement/companiesManagement">Back to Company Management</Link>
        </div>
      );
    }
    
    return (
      <div>
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
    }
	});

module.exports = ChangeCompanyName;