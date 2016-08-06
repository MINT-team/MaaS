// Name: {ExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var RequestExternalDatabasesActionCreator = require('../../actions/Request/RequestExternalDatabasesActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

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
          isLogged: SessionStore.isLogged()
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
      alert(CompanyStore.getId());
      RequestExternalDatabasesActionCreator.getDbs(CompanyStore.getId());
  },

  componentWillUnmount: function() {
      //Collapse.removeChangeListener(this._onChange);
      //SessionStore.removeChangeListener(this._onChange);
      ExternalDatabaseStore.removeChangeListener(this._onChange);
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
  
    var data = [
      {
        id: null,
        name: "Prova",
        allowed: "true"
      }
    ];
    
    var options = {
      noDataText: "There are no DSL definitions to display"
    };
  
    
    //var databases = ExternalDatabaseStore.getDbNames();
    var title, content;
    title = "Manage Database";
    content = (
          <div id="content">
            <div id="successful-operation">
                <p>Manage your external database, add new or disable existing ones.</p>
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
            <div id="table-database">
              <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data} search={true} striped={true} hover={true}>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="allowed">Status</TableHeaderColumn>
              </BootstrapTable>
            </div>
            </div>
          );
        
    return (
      <div className="container sidebar-container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
  }
});

/*

<Collapse _onChange={this.handleChange} isOpened={this.state._isOpened} >
              <BootstrapTable ref="table" keyField="id" selectRow={selectRowProp} pagination={true} data={data} search={true} striped={true} hover={true}>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="allowed">Status</TableHeaderColumn>
              </BootstrapTable>
              </Collapse>
*/

module.exports = ExternalDatabases;