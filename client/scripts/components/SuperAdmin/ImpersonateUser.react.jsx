var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    return {
            isImpersonate: SessionStore.getImpersonate(),
            userType: SessionStore.whoIam(),
            users: UserStore.getAllUsers(),
            errors: UserStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            type: "All"
    };
}

var ImpersonateUser = React.createClass({
    
    contextTypes: {   // serve per utilizzare il router
      router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
        return getState();
    },

    componentWillMount: function() {
        if(this.state.isImpersonate == "true") RequestSessionActionCreator.leaveImpersonate();
        else  RequestUserActionCreator.getUsers(); 
        
        UserStore.addChangeListener(this._onChange);
        UserStore.addAllUsersLoadListener(this._onChange);
        SessionStore.addLeaveImpersonateListener(this._onLeave);
        SessionStore.addImpersonateListener(this.onImpersonate);
        UserStore.addUserLoadListener(this._onUserLoad);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
        UserStore.removeAllUsersLoadListener(this._onChange);
        SessionStore.removeLeaveImpersonateListener(this._onLeave);
        SessionStore.removeImpersonateListener(this.onImpersonate);
        UserStore.removeUserLoadListener(this._onUserLoad);
    },
    
    //impersonifico -> premo tasto "indietro" del browser -> eseguo il leave dall'utente imperonificato -> eseguo la richiesta con access token del super admin
    _onLeave: function(){  
        RequestUserActionCreator.getUsers();
    },
    
    handleRedirect: function() {
        // const { router } = this.context;
        // router.push('/manageDSL'); 
        const { router } = this.context;
          if (this.state.activeDashboard == "default")
          {
            router.push('/manageDSL');   // redirect to Dashboard page
          }
          else
          {
           router.push('/manageDSL/executeDSL/'+this.state.activeDashboard);
          }
    },

    _onUserLoad: function() {
        this.setState({ activeDashboard: UserStore.getActiveDashboard() });
        this.handleRedirect();
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    onImpersonate: function() {
        RequestUserActionCreator.getUser(SessionStore.getUserId());
        RequestUserActionCreator.getCompany(SessionStore.getUserId());
        RequestUserActionCreator.getEditorConfig(SessionStore.getUserId());
    },
    
    buttonFormatter: function(cell, row) {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <span id="errors">{this.state.errors}</span>
            );
        }
   
        var onClickImpersonate = function() {
            RequestSessionActionCreator.createAccessToken(row.id);
        };

        return (
            <div className="table-buttons">
                <i onClick={onClickImpersonate} id="impersonate-button" className="material-icons md-24">&#xE572;</i>
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
  
        if(!this.state.isLogged || this.state.userType != "superAdmin") 
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
                        companyId: user.companyId,
                        password: user.password
                    };
                });
            }
            
            
            title = "Impersonate User";
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
                            search={true} striped={true} hover={true} options={options} keyField="id">
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

module.exports = ImpersonateUser;