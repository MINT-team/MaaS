var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var SuperAdminStore = require('../../stores/SuperAdminStore.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var RequestSuperAdminActionCreator = require('../../actions/Request/RequestSuperAdminActionCreator.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


function getState() {
  return {
      userType: SessionStore.whoIam(),
      errors: [],//SuperAdminStore.getErrors(),
      isLogged: SessionStore.isLogged(),
      companies: CompanyStore.getCompanies()       //JSON that contains the companies in the system 
  };
}

var CompaniesManagement = React.createClass({
  
  getInitialState: function() {
      return getState();
  },

 componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
        SuperAdminStore.addChangeListener(this._onChange);
        CompanyStore.addChangeListener(this._onChange);
        
        RequestCompanyActionCreator.getCompanies();
  },
  
  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      SuperAdminStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
  },
  
  _onChange: function() {
      this.setState(getState());
  },
  
  buttonFormatter: function(cell, row) {
        var buttons;
        var errors;
        var errorId ="errorDropdown"+row.id;
        var deleteId ="deleteDropdown"+row.id;
        if(this.state.errors.length > 0) {
            errors = (
              <span id="errors">{this.state.errors}</span>
            );
        }
        // funzioni utili all'eliminazione di una company
        var instance = this;
        var onClickDelete = function() {
            if(instance.state.errors.length > 0)
    		    {
    		      document.getElementById(errorId).classList.toggle("dropdown-show");
    		      //this.refs.errorRefName.classList.toggle("dropdown-show");
    		    }
    		    else
    		    {
    		      document.getElementById(deleteId).classList.toggle("dropdown-show");
    		      //this.refs.deleteRefName.classList.toggle("dropdown-show");
    		    }
        };
        
        var confirmDelete = function() {
            RequestCompanyActionCreator.deleteCompany(row.id, row.owner);  //row.owner -> owner email
        };
        
        var deleteCompany = (
            <div id="delete-user" className="pop-up">
                <i onClick={onClickDelete} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup-SA" id={errorId}>
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup-SA" id={deleteId}>
                    <p className="dropdown-title">Delete company</p>
                    <p className="dropdown-description">Are you sure you want to delete </p> 
                    <p className="dropdown-description"> <span id="successful-email">{row.name}</span> ?</p> 
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
        
            buttons = (
                <div>
                    {deleteCompany}
                    <Link to={"/dashboardSuperAdmin/databaseManagement/companiesManagement/changeCompanyName/"+ row.id + "/" + row.name } ><i id="modify-button" className="material-icons md-24">&#xE254;</i></Link>
                </div>
            );
        
        
        return (
            <div className="table-buttons">
                {buttons}
            </div>
        );
    },
    deleteAllSelected: function() {
        if (this.refs.table.state.selectedRowKeys.length > 0)
        {
            RequestCompanyActionCreator.deleteAllSelectedCompanies(this.refs.table.state.selectedRowKeys);
        }
    },
  
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0 || this.state.userType != "superAdmin") 
        {
          return (
            <AuthorizationRequired />
          );
        }
        if(this.props.children)
        {
            content = this.props.children;
        }
        else
        {
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
                        <div className="top-buttons">
                            <div className="tooltip tooltip-bottom" id="deleteAll-button">
                                <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                                <p className="tooltip-text tooltip-text-long">Delete all selected companies</p>
                            </div>
                        </div>
                    </div>
                    <div id="table">
                        <BootstrapTable ref="table" keyField="id" pagination={true} data={data}
                            search={true} striped={true} hover={true} options={options} selectRow={selectRowProp}>
                          <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                          <TableHeaderColumn dataField="owner" dataSort={true}>Owner</TableHeaderColumn>
                          <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            );
        }
        return (
          <div className="container sidebar-container">
            {content}
          </div>
        );
    }
});

module.exports = CompaniesManagement;

