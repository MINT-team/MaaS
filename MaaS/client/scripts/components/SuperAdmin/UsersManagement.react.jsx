// Name: {UsersManagement.react.jsx}
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
            users: UserStore.getAllUsers(),
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            type: "All"
    };
}

var usersManagement = React.createClass({
    
    getInitialState: function() {
        return getState();
    },

    componentWillMount: function() {
        RequestUserActionCreator.getUsers();  //Recovery all the users
        UserStore.addChangeListener(this._onChange);
        UserStore.addDeleteListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
        UserStore.removeDeleteListener(this._onChange);
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
           RequestUserActionCreator.deleteUser(row.email,row.id);
        };
        
        var deleteUser = (
            <div id="delete-user" className="pop-up">
                <i onClick={onClickDelete} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" id={errorId}>
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" id={deleteId}>
                    <p className="dropdown-title">Delete user</p>
                    <p className="dropdown-description">Are you sure you want to delete <span id="successful-email">{row.email}</span> user?</p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
        
        if(row.role == "Owner")
        {
            buttons = (
                <div>
                    <Link to={"/"} ><i id="modify-button" className="material-icons md-24">&#xE254;</i></Link>
                </div>
            );
        }else
        {
            buttons = (
            <div>
                {deleteUser}
                <Link to={"/"} ><i id="modify-button" className="material-icons md-24">&#xE254;</i></Link>
            </div>
            );
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
    
    onAdministratorsClick: function() {
        this.refs.table.handleFilterData({
            role: 'Administrator'
        });
        this.setState({type: "Administrator"});
    },
    
    onMembersClick: function() {
        this.refs.table.handleFilterData({
            role: 'Member'
        });
        this.setState({type: "Member"});
    },
    
    onGuestsClick: function() {
        this.refs.table.handleFilterData({
            role: 'Guest'
        });
        this.setState({type: "Guest"});
    },
    
    render: function() {
  
        if(!this.state.isLogged || this.state.errors.length > 0) 
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
            
            var administrators = {
                label: "Administrators",
                onClick: this.onAdministratorsClick,
                icon: (<i className="material-icons md-24">&#xE8EF;</i>)
            };
            var members = {
                label: "Members",
                onClick: this.onMembersClick,
                icon: (<i className="material-icons md-24">&#xE871;</i>)
            };
            var guests = {
                label: "Guests",
                onClick: this.onGuestsClick,
                icon: (<i className="material-icons md-24">list</i>)
            };
            
            var data = [];
            var selectRowProp = {
                mode: "checkbox",
                clickToSelect: true,
                bgColor: "rgba(144, 238, 144, 0.42)"
            };
            
            var options = {
                noDataText: "There are no users to display"
            };
            
            var sidebarData = [all, administrators, members, guests];
            if(this.state.users && this.state.users.length > 0)
            {
                this.state.users.forEach(function(user, i) {
                    data[i] = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        companyName: user.companyName
                    };
                });
            }
            
            title = "Manage users";
            content = (
                <div id="manage-dsl">
                    <Sidebar title="Users filter" data={sidebarData}/>
                    <div className="container sidebar-container">
                        <p className="container-title">{title}</p>
                        <div id="table-top">
                            <p id="filter-type">{this.state.type}</p>
                           
                        </div>
                        <div id="table">
                            <BootstrapTable ref="table" data={data} pagination={true} 
                            search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="email">
                                <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
                                <TableHeaderColumn dataField="role" dataSort={true}>Role</TableHeaderColumn>
                                <TableHeaderColumn dataField="companyName" dataSort={true}>Company</TableHeaderColumn>
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

module.exports = usersManagement;