// Name: {ExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var Sidebar = require('../Sidebar.react.jsx');
var Link = require('react-router').Link;
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var RequestExternalDatabaseActionCreator = require('../../actions/Request/RequestExternalDatabaseActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var AddExternalDatabase = require('./AddExternalDatabase.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
  return {
          errors: ExternalDatabaseStore.getErrors(),
          isLogged: SessionStore.isLogged(),
          type: "All",
          databases: ExternalDatabaseStore.getDbs()
      };
}

var ExternalDatabases = React.createClass({
  
  contextTypes: {   // serve per utilizzare il router
    router: React.PropTypes.object.isRequired
  },
  
  getInitialState: function() {
      return getState();
  },
  
  _onChange: function() {
    	this.setState(getState());
  },
  
  componentWillMount: function() {
    ExternalDatabaseStore.addChangeListener(this._onChange);
    RequestExternalDatabaseActionCreator.getDbs(CompanyStore.getId());
  },
  
  componentWillUnmount: function() {
    ExternalDatabaseStore.removeChangeListener(this._onChange);
  },
  
  buttonFormatter: function(cell, row) {
    
    var delDropdown ="deleteDropdown"+row.id;
    var stateDropdown ="stateDropdown"+row.id;
    
    var tryDel = function() {
      document.getElementById(delDropdown).classList.toggle("dropdown-show");
    };
    
    var tryChangeState = function() {
      document.getElementById(stateDropdown).classList.toggle("dropdown-show");
    };
    
    var confirmDelete = function() {
      RequestExternalDatabaseActionCreator.deleteDb(row.id, CompanyStore.getId());
    };
    
    var confirmChangeState = function() {
      var newStatus;
      if(row.connected == 'true')
      {
        newStatus = 'false';
      }
      else
      {
        newStatus = 'true';
      }
      RequestExternalDatabaseActionCreator.changeStateDb(row.id, newStatus, CompanyStore.getId());
    };
    
    var titleState;
    var messageState;
    if (row.connected == 'true')
    {
      titleState="Disconnect database";
      messageState = (
        <p className="dropdown-description">Are you sure you want to <span id="successful-email">disconnect {row.name}</span>?</p>
      );
    }
    else
    {
      titleState="Connect database";
      messageState = (
        <p className="dropdown-description">Are you sure you want to <span id="successful-email">connect {row.name}</span>?</p>
      );
    }
  
    
    return (
      <div className="table-buttons">
          <div className="tooltip tooltip-bottom pop-up" id="Change-button">
            <i onClick={tryChangeState} className="material-icons md-24 dropdown-button">&#xE8D4;</i>
            <div className="dropdown-content dropdown-popup" id={stateDropdown}>
			        <p className="dropdown-title">{titleState}</p>
			        {messageState}
              <div className="dropdown-buttons">
                <button className="inline-button">Cancel</button>
                <button id="delete-button" onClick={confirmChangeState} className="inline-button">Confirm</button>
              </div>
		        </div>
          </div>
          <div className="tooltip tooltip-bottom pop-up" id="Delete-button">
            <i onClick={tryDel} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
            <div className="dropdown-content dropdown-popup" id={delDropdown}>
			        <p className="dropdown-title">Delete Database</p>
			        <p className="dropdown-description">Are you sure you want to delete <span id="successful-email">{row.name}</span> Database?</p>
              <div className="dropdown-buttons">
                <button className="inline-button">Cancel</button>
                <button id="delete-button" onClick={confirmDelete} className="inline-button">Delete</button>
              </div>
		        </div>
       	  </div>
      </div>
    );
  },
  statusFormatter: function(cell,row) {
    var status;
    
    if(row.connected == 'true')
    {
      status = (
      <div className="led-box">
        <div className="led-green"></div>
      </div>
      );
    }
    else
    {
      status = (
      <div className="led-box">
        <div className="led-red"></div>
      </div>
      );
    }
      
    return (
      <div>
      {status}
      </div>
    );
  },
  
  onAllClick: function() {
      this.refs.table.handleFilterData({ });
      this.setState({type: "All"});
  },
    
  onConnectedClick: function() {
      this.refs.table.handleFilterData({
          connected: 'true'
      });
      this.setState({type: "Connected"});
  },
  
  onDisconnectedClick: function() {
      this.refs.table.handleFilterData({
          connected: 'false'
      });
      this.setState({type: "Disconnected"});
  },
  
  deleteAllSelected: function() {
    alert(this.refs.table.state.selectedRowKeys);
  },
  
  render: function() {
    if(!this.state.isLogged)
    {
      return (
        <AuthorizationRequired />
      );
    }
    if (this.props.params.mode != "select")
    {
      var all = {
        label: "All",
        onClick: this.onAllClick,
        icon: (<i className="material-icons md-24">&#xE8EF;</i>)
      };
      var connected = {
          label: "Connected",
          onClick: this.onConnectedClick,
          icon: (<i className="material-icons md-24">&#xE8C0;</i>)
      };
      var disconnected = {
          label: "Disconnected",
          onClick: this.onDisconnectedClick,
          icon: (<i className="material-icons md-24">&#xE033;</i>)
      };
      
      var sidebarData = [all, connected, disconnected];
      
      var selectRowProp = {
          mode: "checkbox",
          bgColor: "rgba(144, 238, 144, 0.42)"
      };
    }
  
    var data = [];
    var instance = this;
    if(this.state.databases && this.state.databases.length > 0)
    {
        this.state.databases.forEach(function(database, i) {
          if(instance.props.params.mode != "select" || (instance.props.params.mode == "select" && database.connected == "true") )
            data.push({
                id: database.id,
                name: database.name,
                connected: database.connected,
                connectionString: database.connString
            });
        });
    }
    
    const { router } = this.context;
    var options;
    if(this.props.params.mode == "select")
    {
      options = {
        onRowClick: function(row){
          router.push('/manageDSL/manageDSLSource?databaseID=' + row.id);   // redirect to DSL page
        },
        noDataText: "There are no databases to display"
      };
    }
    else
    {
      options = {
        noDataText: "There are no databases to display"
      };
    }
  
    
    var title, content;
    if(this.props.params.mode != "select")
      title = "Manage databases";
    else
      title = "Select one database";
    content = (
          <div id="manage-externalDatabases">
            {this.props.params.mode != "select" ?
              <Sidebar title="Filter databases" data={sidebarData}/>
            : "" }
              <div className={this.props.params.mode == "select" ? "container" : "container  sidebar-container" }>
              <p className="container-title">{title}</p>
              {this.props.params.mode != "select" ?
                <div id="table-top">
                  <p id="filter-type">{this.state.type}</p>
                  <div id="top-buttons">
                    <div className="tooltip tooltip-bottom" id="add-button">
                      <AddExternalDatabase />
                      <p className="tooltip-text tooltip-text-long">Add new database</p>
                    </div>
                    <div className="tooltip tooltip-bottom" id="deleteAll-button">
                      <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                      <p className="tooltip-text tooltip-text-long">Delete all selected databases</p>
                    </div>
                  </div>
                </div>
              : "" }
              <div id="table">
                {this.props.params.mode == "select" ?
                  <BootstrapTable ref="table" keyField="id" pagination={true} data={data} 
                  search={true} striped={true} hover={true} options={options}>
                    <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                  </BootstrapTable>
                
                : 
                  <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data} 
                search={true} striped={true} hover={true} options={options}>
                    <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                    <TableHeaderColumn dataField="status" dataFormat={this.statusFormatter}>Status</TableHeaderColumn>
                    <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                  </BootstrapTable>}
              </div>
            </div>
          </div>
          );
        
    return (
      <div id="externalDatabases">
        {content}
      </div>
    );
  }
});

module.exports = ExternalDatabases;