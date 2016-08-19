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
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    return {
            users: UserStore.getAllUsers(),
            errors: UserStore.getErrors(),
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
        UserStore.addUserLoadListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
        UserStore.removeDeleteListener(this._onChange);
        UserStore.removeUserLoadListener(this._onChange);
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
    		    }
    		    else
    		    {
    		      document.getElementById(deleteId).classList.toggle("dropdown-show");
    		    }
        };
        
        var confirmDelete = function() {
           if(row.role != "Owner")
                RequestUserActionCreator.deleteUser(row.email,row.id);
           else{
               RequestCompanyActionCreator.deleteCompany(row.companyId, row.email);
           }
                
        };
        
        var alertBox;
        if(row.role != 'Owner')
        {
            alertBox = ( 
                <div>
                    <p className="dropdown-description">Are you sure you want to delete</p>
                    <p className="dropdown-description"> 
                        <span id="successful-email">{row.email}</span> 
                    </p>
                    <p className="dropdown-description">?</p>
                </div>
                    );
        }
        else
        {
            alertBox = ( <div>
                            <p className="dropdown-description">Are you sure you want to delete </p>
                            <p className="dropdown-description"> 
                                <span id="successful-email">{row.email}</span> 
                            </p>
                            <p className="dropdown-description">?</p>
                            <p className="dropdown-description"> <span id="successful-email"> This will delete the entire company!</span></p>
                        </div>
                        );
        }
    
        
        var deleteUser = (
            <div id="delete-user" className="pop-up">
                <i onClick={onClickDelete} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup-SA delUser" id={errorId}>
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup-SA delUser" id={deleteId}>
                    <p className="dropdown-title">Delete user</p>
                    {alertBox}
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
        
       
            buttons = (
            <div>
                {deleteUser}
                <Link to={"/dashboardSuperAdmin/databaseManagement/usersManagement/changeUserPersonalData/"+ row.id} ><i id="modify-button" className="material-icons md-24">&#xE254;</i></Link>
            </div>
            );
        
        
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
    
    onOwnersClick: function() {
        this.refs.table.handleFilterData({
            role: 'Owner'
        });
        this.setState({type: "Owner"});
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
                icon: (<i className="material-icons md-24">&#xE8D3;</i>)
            };
            
            var owner = {
                label: "Owners",
                onClick: this.onOwnersClick,
                icon: (<i className="material-icons md-24">&#xE8F4;</i>)
            };
            
            var administrators = {
                label: "Administrators",
                onClick: this.onAdministratorsClick,
                icon: (<i className="material-icons md-24">&#xE853;</i>)
            };
            var members = {
                label: "Members",
                onClick: this.onMembersClick, 
                icon: (<i className="material-icons md-24">&#xE7FD;</i>)
            };
            var guests = {
                label: "Guests",
                onClick: this.onGuestsClick,
                icon: (<i className="material-icons md-24">&#xE7FF;</i>)
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
            
            var sidebarData = [all, owner, administrators, members, guests];
            if(this.state.users && this.state.users.length > 0)
            {
                this.state.users.forEach(function(user, i) {
                    data[i] = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        companyName: user.companyName,
                        companyId: user.companyId
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
                            search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                                <TableHeaderColumn dataField="email" dataSort={true} columnClassName="emailColumn" >Email</TableHeaderColumn>
                                <TableHeaderColumn dataField="role" dataSort={true} columnClassName="roleColumn">Role</TableHeaderColumn>
                                <TableHeaderColumn dataField="companyName" dataSort={true}>Company</TableHeaderColumn>
                                <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter} columnClassName="buttonColumn"></TableHeaderColumn>
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