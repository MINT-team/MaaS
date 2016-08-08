// Name: {CompaniesManagement.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================


var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var RequestSuperAdminActionCreator = require('../../actions/Request/RequestSuperAdminActionCreator.react.jsx');
var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var DeleteCompany = require('./DeleteCompany.react.jsx');


function getState() {
  return {
      errors: [],//DSLStore.getErrors(),
      isLogged: SessionStore.isLogged(),
      companies: CompanyStore.getCompanies()  //JSON that contains the companies in the system 
  };
}

var CompaniesManagement = React.createClass({
  
  getInitialState: function() {
      return getState();
  },

 componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
        CompanyStore.addChangeListener(this._onChange);
        RequestSuperAdminActionCreator.getCompanies();
  },
  
  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
  },
  
  _onChange: function() {
      this.setState(getState());
  },
  
  
  deleteAllSelected: function() {
    alert(this.refs.table.state.selectedRowKeys);
  },
  
  buttonFormatter: function(cell, row) {
    
    return(
      <div>
        <DeleteCompany id={row.id} name={row.name} email={row.owner}/>
      </div>
      );
    /*return (
      <div className="companiesManagement-buttons">
        <div>Bottone modifica</div>
        <div>Bottone eliminazione</div>
      </div>
    );*/
  },
  
  render: function() {
    if(!this.state.isLogged || this.state.errors.length > 0) 
    {
      return (
        <AuthorizationRequired />
      );
    }
    
    var selectRowProp = {
        mode: "checkbox",
        clickToSelect: true,
        bgColor: "rgba(144, 238, 144, 0.42)",
    };
    
    var options = {
      noDataText: "There are no companies to display"
    };
    
    var data = [];
    if(this.state.companies && this.state.companies.length > 0)
    {
      this.state.companies.forEach(function(company, i) {
                    data[i] = {
                        id: company.id,
                        name: company.name,
                        owner: company.owner.email
                    };
                });
            }
    
    var title, content;
    title = "Manage companies";
	  content = (
	    <div id="manage-companies">
        <p className="container-title">{title}</p>
          <div id="table-top">
            <div id="top-buttons">
              <div className="tooltip tooltip-bottom" id="deleteAll-button">
                <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                <p className="tooltip-text tooltip-text-long">Delete all selected companies</p>
              </div>
            </div>
          </div>
          <div id="table">
            <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data}
                search={true} striped={true} hover={true} options={options}>
              <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
              <TableHeaderColumn dataField="owner" dataSort={true}>Owner</TableHeaderColumn>
              <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
            </BootstrapTable>
          </div>
        </div>
        
    );
    
    return (
      <div className="container sidebar-container">
        {content}
      </div>
    );
  }
});

module.exports = CompaniesManagement;

