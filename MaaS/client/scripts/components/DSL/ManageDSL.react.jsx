// Name: {ManageDSL.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DashboardStore = require('../../stores/DashboardStore.react.jsx');
var CollectionStore = require('../../stores/CollectionStore.react.jsx');
var DocumentStore = require('../../stores/DocumentStore.react.jsx');
var CellStore = require('../../stores/CellStore.react.jsx');
var RequestDashboardActionCreator = require('../../actions/Request/RequestDashboardActionCreator.react.jsx');
var RequestCollectionActionCreator = require('../../actions/Request/RequestCollectionActionCreator.react.jsx');
var RequestDocumentActionCreator = require('../../actions/Request/RequestDocumentActionCreator.react.jsx');
var RequestCellActionCreator = require('../../actions/Request/RequestCellActionCreator.react.jsx');

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var TableRow = ReactBSTable.TableRow;

function getState() {
  return {
            errors: DashboardStore.getErrors(),
            isLogged: SessionStore.isLogged()
      };
}

var ManageDSL = React.createClass({
    
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        
    },

    componentWillUnmount: function() {
        
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) {
            alert(this.state.isLogged);
            alert(this.state.errors);
            return (
                <div className="container">
                  <p className="container-title">Authorization required</p>
                  <p className="container-description">You are not authorized to view this page</p>
                  <Link to="/" className="button">Back to home</Link>
                </div>
            );
        }
    
        // SideBar initialization
        var onAllClick = function() {
            alert("ALL");
        }
        var onDashboardsClick = function() {
            
        }
        var onCollectionsClick = function() {
            
        }
        var onDocumentsClick = function() {
            
        }
        var onCellsClick = function() {
            
        }
        var all = {
            label: "All",
            onClick: onAllClick,
            icon: (<i className="material-icons md-24">&#xE8EF;</i>)
        };
        var dashboards = {
            label: "Dashboards",
            onClick: onDashboardsClick,
            icon: (<i className="material-icons md-24">&#xE871;</i>)
        };
        var collections = {
            label: "Collections",
            onClick: onCollectionsClick,
            icon: (<i className="material-icons md-24">list</i>)
        };
        var documents = {
            label: "Documents",
            onClick: onDocumentsClick,
            icon: (<i className="material-icons md-24">&#xE873;</i>)
        };
        var cells = {
            label: "Cells",
            onClick: onCellsClick,
            icon: (<i className="material-icons md-24">&#xE3BC;</i>)
        };
        
        var selectRowProp = {
            mode: "checkbox",
            clickToSelect: true,
            bgColor: "rgba(144, 238, 144, 0.42)",
        };
        
        var data = [
        {
            name: "Prova",
            allowed: "true"
        }
        ];
        var sidebarData = [all, dashboards, collections, documents, cells];
        var title, content;
        
        title = "Manage your DSL definitions";
        content = (
            <div className="container sidebar-container">
                <p className="container-title">{title}</p>
                <div id="createDSLDefinition">
                <Link to="/" className="button">Create new DSL definition</Link>
                <div id="table-dsl">
                    <BootstrapTable selectRow={selectRowProp} data={data} pagination={true} search={true} striped={true} hover={true}>
                        <TableHeaderColumn isKey={true}  dataField="name">Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="allowed"></TableHeaderColumn>
                    </BootstrapTable>
                </div>
                </div>
            </div>
          );
        return (
          <div id="dsl">
            <Sidebar title="Filter DSL" data={sidebarData}/>
            {content}
          </div>
        );
    }
});

module.exports = ManageDSL;