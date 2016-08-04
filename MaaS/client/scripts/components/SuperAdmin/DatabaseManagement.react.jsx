// Name: {DatabaseManagement.react.jsx}
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
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
  return {
            errors: [],//DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            companies: CompanyStore.getCompanies()
      };
}

var DatabaseManagement = React.createClass({
    
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
    
    buttonFormatter: function(cell, row) {
        return (
            <div>
                <i onClick="" className="material-icons md-24 dropdown-button">&#xE254;</i>
                <i onClick="" className="material-icons md-24 dropdown-button">&#xE5C9;</i>
            </div>
        );
    },
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) 
        {
            return (
                <AuthorizationRequired />
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
        
        var data = [
            {
                company: "Prova"
            },
            {
                company: "Prova2"
            }
        ];
        var sidebarData = [all, dashboards, collections, documents, cells];
        var title, content;
        
        
        title = "In the system there are";
        content = (
            <div>
                <Sidebar title="Manage the internal database" data={sidebarData}/>
                <div className="container sidebar-container">
                    <p className="container-title">{title}</p>
                    <div id="createDSLDefinition">
                        <Link to="/manageDSL/manageDSLSource" className="button">Create new DSL definition</Link>
                        <div id="table-dsl">
                            <BootstrapTable data={data} pagination={true} search={true} striped={true} hover={true}>
                                <TableHeaderColumn isKey={true}  dataField="company">Company</TableHeaderColumn>
                                <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}>Actions</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
            </div>
        );
        return (
            <div id="dsl">
                {this.props.children || content}
            </div>
        );
    }
});

module.exports = DatabaseManagement;