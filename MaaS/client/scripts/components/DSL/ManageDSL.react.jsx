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
var UserStore = require('../../stores/UserStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var DeleteDSL = require('./DeleteDSL.react.jsx');

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
  return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            definitionId: null,
            DSL_LIST: DSLStore.getDSLList(),
            role: UserStore.getRole(),
            userId: UserStore.getId()
      };
}

var ManageDSL = React.createClass({
    
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        if(!this.props.children)
            RequestDSLActionCreator.loadDSLList(SessionStore.getUserId());
        DSLStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    buttonFormatter: function(cell, row) {
        var buttons;
        if(this.state.role != "Guest"/*this.state.role == "Owner" || this.state.role == "Admin"*/)
        {
            buttons = (
                <div>
                    <Link to={"/manageDSL/manageDSLSource/" + row.id }><i className="material-icons md-24">&#xE254;</i></Link>
                    <i onClick="" className="material-icons md-24 dropdown-button">&#xE32A;</i>
                    <DeleteDSL id={row.id} name={row.name} />
                </div>
            );
        }
        else
        {
            /*
            if(this.state.role == "Member" && row.createdBy == this.state.userId)
            {
                buttons = (
                    <div>
                        <i onClick="" className="material-icons md-24 dropdown-button">&#xE254;</i>
                        <DeleteDSL id={row.id} name={row.name} />
                    </div>
                );
            }
            
            if(this.state.role == "Member" && row.createdBy != this.state.userId)
            {
                buttons = (
                    <div>
                        <i onClick="" className="material-icons md-24 dropdown-button">&#xE254;</i>
                        <DeleteDSL id={row.id} name={row.name} />
                    </div>
                );
            }
            */
        }
        return (
            <div className="dsl-buttons">
                {buttons}
            </div>
        );
    },
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) 
        {
            alert(this.state.errors);
            return (
                <AuthorizationRequired />
            );
        }
    
        // SideBar initialization
        var onAllClick = function() {
            alert("all");
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
        
        var data = [];
        var selectRowProp = {
            clickToSelect: true
        };
        if(this.state.DSL_LIST && this.state.DSL_LIST.length > 0)
        {
            this.state.DSL_LIST.forEach(function(DSL, i) {
                data[i] = {id: DSL.id,name: DSL.name};
            });
        }
        // [
        //     {
        //         name: "Prova"
        //     },
        //     {
        //         name: "Prova2"
        //     }
        // ];
        var sidebarData = [all, dashboards, collections, documents, cells];
        var title, content;
        
        if(this.props.children)
        {
            const childrenWithDefinitionId = React.Children.map(this.props.children,
                (child) => React.cloneElement(child, {
                    definitionId: this.state.definitionId
                })
            );
            content = childrenWithDefinitionId;
        }
        else
        {
            title = "Manage your DSL definitions";
            content = (
                <div>
                    <Sidebar title="Filter DSL" data={sidebarData}/>
                    <div className="container sidebar-container">
                        <p className="container-title">{title}</p>
                        <div id="createDSLDefinition">
                        <i className="material-icons md-36">&#xE147;</i>
                            <Link to="/manageDSL/manageDSLSource" className="button">Create new DSL definition</Link>
                            <div id="table-dsl">
                                <BootstrapTable ref="table" data={data} pagination={true} search={true} striped={true} hover={true} selectRow={selectRowProp}>
                                    <TableHeaderColumn isKey={true} dataField="name">Name</TableHeaderColumn>
                                    <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                                </BootstrapTable>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div id="dsl">
                {content}
            </div>
        );
    }
});

module.exports = ManageDSL;