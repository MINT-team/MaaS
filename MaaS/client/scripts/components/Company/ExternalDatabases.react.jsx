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
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var RequestExternalDatabaseActionCreator = require('../../actions/Request/RequestExternalDatabaseActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var AddExternalDatabase = require('./AddExternalDatabase.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var ReactMotion = require('react-motion');
var Collapse = require('react-collapse');
var ReactHeight = require('react-height');

function getState() {
  return {
          errors: ExternalDatabaseStore.getErrors(),
          isOpened: false,
          _isOpened: true,
          isLogged: SessionStore.isLogged(),
          type: "All"
      };
}

var ExternalDatabases = React.createClass({
  
  getInitialState: function() {
      return getState();
  },
  
  _onChange: function() {
    	this.setState(getState());
  },
  
  openForm: function(){
    this.setState({isOpened: !this.state.isOpened});
    if(this.state.isOpened) { 
        this.refs.table.setState({_isOpened: false});
    }
 },
 
  /*handleChange: function(event) {
    this.setState({value: event.target.value});
  },
  */
  componentDidMount: function() {
      //Collapse.addChangeListener(this._onChange);
      //SessionStore.addChangeListener(this._onChange);
      ExternalDatabaseStore.addChangeListener(this._onChange);
      RequestExternalDatabaseActionCreator.getDbs(CompanyStore.getId());
  },

  componentWillUnmount: function() {
      //Collapse.removeChangeListener(this._onChange);
      //SessionStore.removeChangeListener(this._onChange);
      ExternalDatabaseStore.removeChangeListener(this._onChange);
  },
  
  buttonFormatter: function(cell, row) {
    return (
      <div className="externalDatabases-buttons">
        <div>Bottone disconnessione</div>
        <div>Bottone eliminazione</div>
      </div>
    );
  },
  statusFormatter: function(cell,row) {
    return (
    <div className="led-box">
      <div className="led-green"></div>
    </div>
    );
  },
  
  onAllClick: function() {
      this.refs.table.handleFilterData({ });
      this.setState({type: "All"});
  },
    
  onConnectedClick: function() {
      /*this.refs.table.handleFilterData({
          type: 'Connected'
      });*/
      this.setState({type: "Connected"});
  },
  
  onDisconnectedClick: function() {
      /*this.refs.table.handleFilterData({
          type: 'Disconnected'
      });*/
      this.setState({type: "Disconnected"});
  },
  
  deleteAllSelected: function() {
    alert(this.refs.table.state.selectedRowKeys);
  },
  
  render: function() {
    if(!this.state.isLogged || this.state.errors.length > 0) 
    {
      return (
        <AuthorizationRequired />
      );
    }
    
    var all = {
      label: "All",
      onClick: this.onAllClick,
      icon: (<i className="material-icons md-24">&#xE8EF;</i>)
    };
    var connected = {
        label: "Connected",
        onClick: this.onConnectedClick,
        icon: (<i className="material-icons md-24">&#xE871;</i>)
    };
    var disconnected = {
        label: "Disconnected",
        onClick: this.onDisconnectedClick,
        icon: (<i className="material-icons md-24">list</i>)
    };
    
    var sidebarData = [all, connected, disconnected];
    var selectRowProp = {
        mode: "checkbox",
        bgColor: "rgba(144, 238, 144, 0.42)",
    };
  
    var data = [
      {
        id: null,
        name: "Prova"
      }
    ];
    
    var options = {
      onRowClick: function(row){
        //Show information page of ExternalDatabase
      },
      noDataText: "There are no external databases to display"
    };
  
    
    //var databases = ExternalDatabaseStore.getDbNames();
    var title, content;
    title = "Manage external databases";
    content = (
          <div id="manage-externalDatabases">
            <Sidebar title="Filter external databases" data={sidebarData}/>
            <div className="container sidebar-container">
              <p className="container-title">{title}</p>
              <div id="table-top">
                <p id="filter-type">{this.state.type}</p>
                <div id="top-buttons">
                  <div className="tooltip tooltip-bottom" id="add-button">
                    <AddExternalDatabase />
                    <p className="tooltip-text tooltip-text-long">Add new external database</p>
                  </div>
                  <div className="tooltip tooltip-bottom" id="deleteAll-button">
                    <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                    <p className="tooltip-text tooltip-text-long">Delete all selected external databases</p>
                  </div>
                </div>
              </div>
              <div id="table">
                <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data} 
                search={true} striped={true} hover={true} options={options}>
                  <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                  <TableHeaderColumn dataField="status" dataFormat={this.statusFormatter}>Status</TableHeaderColumn>
                  <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                </BootstrapTable>
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

/*

<div id="successful-operation">
                <p>Manage your external databases, add new or disable existing ones.</p>
            </div>
            <div id="add-database">
            <button onClick={this.openForm} className="inline-button">Add Database</button>
            <button className="inline-button">Delete Database</button>
            <button className="inline-button">Disable Database</button>
              <Collapse isOpened={this.state.isOpened} >
                <form action="" method="post" className="externaldb">
                  <fieldset>
                    <input id="name" name="name" placeholder="Database name" type="text" />
                    <input id="password" name="password" placeholder="Database password" type="password" />    
                    <input id="string" name="string" placeholder="Connection string" type="text" />
                    <button className="inline-button">Add</button>
                  </fieldset>
                </form>
              </Collapse>  
            </div>


<Collapse _onChange={this.handleChange} isOpened={this.state._isOpened} >
              <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data} search={true} striped={true} hover={true}>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="allowed">Status</TableHeaderColumn>
              </BootstrapTable>
              </Collapse>
*/

module.exports = ExternalDatabases;