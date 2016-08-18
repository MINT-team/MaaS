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
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            DSL_LIST: DSLStore.getDSLList(),
            role: UserStore.getRole(),
            userId: UserStore.getId(),
            type: "All"
    };
}

var ManageDSL = React.createClass({
    
    getInitialState: function() {
        return getState();
    },
    
    componentWillMount: function() {
        DSLStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onUserChange);
        RequestUserActionCreator.getUser(this.state.userId);
        if(!this.props.children)
        {
            RequestDSLActionCreator.loadDSLList(SessionStore.getUserId());
        }
    },

    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onUserChange);
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    _onUserChange: function() {
        if(this.state.role != UserStore.getRole())
            alert("Your role has been changed!");
        this.setState({
            role: UserStore.getRole(),
            userId: UserStore.getId(),
        });
    },
    
    nameFormatter: function(cell, row) {
        return (
            <Link to={"/manageDSL/executeDSL/" + row.id}>{row.name}</Link>
        
        );
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
        var instance = this;
        var onClick = function() {
            if(instance.state.errors.length > 0)
                document.getElementById(errorId).classList.toggle("dropdown-show");
    		else
    		    document.getElementById(deleteId).classList.toggle("dropdown-show");
        };
        
        var confirmDelete = function() {
            RequestDSLActionCreator.deleteDSLDefinition(row.id);
        };
        var deleteDSL = (
            <div id="delete-user" className="pop-up">
                <i onClick={onClick} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" id={errorId}>
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" id={deleteId}>
                    <p className="dropdown-title">Delete DSL definition</p>
                    <p className="dropdown-description">Are you sure you want to delete <span id="successful-email">{row.name}</span> DSL definition?</p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
        
        if(this.state.role == "Owner" || this.state.role == "Administrator")
        {
            buttons = (
                <div>
                    <Link to={"/manageDSL/manageDSLSource/" + row.id + '/edit' }><i id="modify-button" className="material-icons md-24">&#xE254;</i></Link>
                    <Link to={"/manageDSL/manageDSLPermissions/" + row.id }><i id="dsl-change-permission" className="material-icons md-24">&#xE32A;</i></Link>
                    {deleteDSL}
                </div>
            );
        }
        else
        {
            if(this.state.role == "Member" && row.permission == "read")
            {
                buttons = (
                    <div>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/view' }><i id="dsl-read" className="material-icons md-24">&#xE86F;</i></Link>
                    </div>
                );
            }
            
            if(this.state.role == "Member" && ( row.permission == "write" || row.createdBy == this.state.userId ))
            {
                buttons = (
                    <div>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/edit' }><i id="dsl-modify" className="material-icons md-24">&#xE254;</i></Link>
                        {deleteDSL}
                    </div>
                );
            }
            if(this.state.role == "Guest" && row.permission == "read")
            {
                buttons = (
                    <div>
                        <Link to={"/manageDSL/manageDSLSource/" + row.id + '/view' }><i id="dsl-modify" className="material-icons md-24">&#xE86F;</i></Link>
                    </div>
                );
            }
        }
        
        return (
            <div className="table-buttons">
                {buttons}
            </div>
        );
    },
    
    onAllClick: function() {
        this.refs.table.handleFilterData({ });
        this.setState({type: "All"});
    },
    
    onDashboardsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Dashboard'
        });
        this.setState({type: "Dashboards"});
    },
    
    onCollectionsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Collection'
        });
        this.setState({type: "Collections"});
    },
    
    onDocumentsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Document'
        });
        this.setState({type: "Documents"});
    },
    
    onCellsClick: function() {
        this.refs.table.handleFilterData({
            type: 'Cell'
        });
        this.setState({type: "Cells"});
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
        var title, content;
        if(this.props.children)
        {
            content = this.props.children;
        }
        else
        {
            // SideBar initialization
            var all = {
                label: "All",
                onClick: this.onAllClick,
                icon: (<i className="material-icons md-24">&#xE8EF;</i>)
            };
            var dashboards = {
                label: "Dashboards",
                onClick: this.onDashboardsClick,
                icon: (<i className="material-icons md-24">&#xE871;</i>)
            };
            var collections = {
                label: "Collections",
                onClick: this.onCollectionsClick,
                icon: (<i className="material-icons md-24">list</i>)
            };
            var documents = {
                label: "Documents",
                onClick: this.onDocumentsClick,
                icon: (<i className="material-icons md-24">&#xE873;</i>)
            };
            var cells = {
                label: "Cells",
                onClick: this.onCellsClick,
                icon: (<i className="material-icons md-24">&#xE3BC;</i>)
            };
            
            var data = [];
            var selectRowProp = {
                mode: "checkbox",
                bgColor: "rgba(144, 238, 144, 0.42)"
            };
            
            var sidebarData = [all, dashboards, collections, documents, cells];
            if(this.state.DSL_LIST && this.state.DSL_LIST.length > 0)
            {
                this.state.DSL_LIST.forEach(function(DSL, i) {
                    data[i] = {
                        id: DSL.dsl.id,
                        name: DSL.dsl.name,
                        permission: DSL.permission,
                        type : DSL.dsl.type
                    };
                });
            }
            var options = {
                noDataText: "There are no DSL definitions to display"
            };
            title = "Manage your DSL definitions";
            content = (
                <div id="manage-dsl">
                    <Sidebar title="Filter DSL" data={sidebarData}/>
                    <div className="container sidebar-container">
                        <p className="container-title">{title}</p>
                        <div id="table-top">
                            <p id="filter-type">{this.state.type}</p>
                            {this.state.role != "Guest" ?
                                <div id="top-buttons">
                                    <div className="tooltip tooltip-bottom" id="add-button">
                                        <Link to="/manageDSL/externalDatabases/select"><i className="material-icons md-48">&#xE147;</i></Link>
                                        <p className="tooltip-text tooltip-text-long">Create new DSL definition</p>
                                    </div>
                                    <div className="tooltip tooltip-bottom" id="deleteAll-button">
                                        <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                                        <p className="tooltip-text tooltip-text-long">Delete all selected DSL definitions</p>
                                    </div>
                                </div>
                            : "" }
                        </div>
                        <div id="table">
                            <BootstrapTable ref="table" data={data} pagination={true} 
                            search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                                <TableHeaderColumn dataField="name" dataSort={true} dataFormat={this.nameFormatter} >Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="type" dataSort={true}>Type</TableHeaderColumn>
                                <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                            </BootstrapTable>
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