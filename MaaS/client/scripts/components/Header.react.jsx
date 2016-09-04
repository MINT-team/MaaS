// Name: {Header.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');
var CompanyStore = require('../stores/CompanyStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');


function getState() {
    return{
        userEmail : UserStore.getEmail(),
        userName : UserStore.getName(),
        userSurname : UserStore.getSurname(),
        userCompany : CompanyStore.getName(),
        isImpersonate: SessionStore.getImpersonate()
    };
}

var Header = React.createClass({
    
    getInitialState: function() {
        return  getState();
    },

    componentDidMount: function() {
    	window.addEventListener('click', this.handleClick);
    	CompanyStore.addChangeListener(this._onChange);
    	SessionStore.addImpersonateListener(this._onChange);
    	UserStore.addUserLoadListener(this._onChange);
    	SessionStore.addLeaveImpersonateListener(this._onLeaveImpersonate);
    },

    componentWillUnmount: function() {
    	window.removeEventListener('click', this.handleClick);
    	CompanyStore.removeChangeListener(this._onChange);
    	SessionStore.removeImpersonateListener(this._onChange);
    	UserStore.removeUserLoadListener(this._onChange);
    	SessionStore.removeLeaveImpersonateListener(this._onLeaveImpersonate);
    },
    
    _onChange: function() {
        this.setState(getState());
    },
    
    _onLeaveImpersonate: function() {
        this.setState({isImpersonate: "false"}); 
    },

	handleClick: function(event) {
	    var dropdowns = document.getElementsByClassName("dropdown-content");
	    console.log(event.target.className);
	    if(!event.target.className.match("dropdown-button")  && dropdowns)
	    {
		    for (var i = 0; i < dropdowns.length; i++)
		    {
				var openDropdown = dropdowns[i];
		    	if (openDropdown.classList.contains("dropdown-show") && !openDropdown.classList.contains("dashboard-popup"))
		    	{
		        	openDropdown.classList.remove("dropdown-show");
		        	alert("kill");
		    	}
			}
		} else {
			event.target.focus();
		}
	},

	toggleDropdown: function(event) {
		event.preventDefault();
		this.refs.dropdownMenu.classList.toggle("dropdown-show");
	},

	logout: function() {
		var accessToken = SessionStore.getAccessToken();
		RequestSessionActionCreator.logout(accessToken);
	},
	
	leaveImpersonate: function() {
	    RequestSessionActionCreator.leaveImpersonate();
	},

    render: function() {
        var title, headerMenu, headerPanel;
        if (this.props.isLogged) {
            if(this.props.type == "commonUser")
            {
                title = (
                    <div className="tooltip tooltip-bottom">
                        <Link to="/company" id="header-title">{this.props.companyName}</Link>
                        <p id="company-tooltip" className="tooltip-text tooltip-text-long">Your company</p>
                    </div>
                );
                headerMenu = (
                    <div id="header-menu">
                        <Link to="/company">Company</Link>
                        <Link to="/externalDatabases">Database</Link>
                        <Link to="/manageDSL">DSL</Link>
                    </div>
                );
                
                headerPanel = (
                    <div id="header-panel">
                        <div className="tooltip tooltip-bottom">
                            <Link to="/profile"><span id="header-user-name">{this.props.userName}</span><i className="material-icons md-36">&#xE7FD;</i></Link>
                            <p id="profile-tooltip" className="tooltip-text">Your profile</p>
                        </div>
                        <div className="tooltip tooltip-bottom">
                            <Link to="" id="settings-button" onClick={this.toggleDropdown}>
                                <i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
                            </Link>
                            <p id="settings-tooltip" className="tooltip-text">Settings</p>
                        </div>
                        <div id="header-dropdown" className="dropdown-content" ref="dropdownMenu">
                            <ul>
                                <Link to="/activeDashboard"><li>Active Dashboard</li></Link>
                                <Link to="/editorConfig"><li>Text editor</li></Link>
                                <Link onClick={this.logout} to=""><li><i className="material-icons md-24">&#xE879;</i>Logout</li></Link>
                            </ul>
                        </div>
                    </div>
                );
            }
            else // render superAdmin Component or impersonate user
            {   
                if(this.state.isImpersonate == "true")        
                {
                    
                    title = (
                    <div className="tooltip tooltip-bottom">
                        <Link to="/company" id="header-title">{this.state.userCompany}</Link>
                        <p id="company-tooltip" className="tooltip-text tooltip-text-long">Your company</p>
                    </div>
                    );
                
                    headerMenu = (
                    <div id="header-menu">
                        <Link to="/company">Company</Link>
                        <Link to="/externalDatabases">Database</Link>
                        <Link to="/manageDSL">DSL</Link>
                    </div>
                    );
                    
                    var name;
                    if(this.state.userName != '')
                    {
                        name = this.state.userName+" "+this.state.userSurname;
                    }
                    else
                    {
                        name = this.state.userEmail;
                    }
                    
                    headerPanel = (
                    <div id="header-panel">
                        <div className="tooltip tooltip-bottom">
                            <Link to="/profile"><span id="header-user-name">You're impersonating: {name}</span><i className="material-icons md-36">&#xE7FD;</i></Link>
                            <p id="profile-tooltip" className="tooltip-text">Your profile</p>
                        </div>
                        <div className="tooltip tooltip-bottom">
                            <Link to="" id="settings-button" onClick={this.toggleDropdown}>
                                <i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
                            </Link>
                            <p id="settings-tooltip" className="tooltip-text">Settings</p>
                        </div>
                        <div id="header-dropdown" className="dropdown-content" ref="dropdownMenu">
                            <ul>
                                <Link to="/manageDashboard"><li>Active Dashboard</li></Link>
                                <Link to="/editorConfig"><li>Text editor</li></Link>
                                <Link onClick={this.leaveImpersonate} to="dashboardSuperAdmin/impersonateUser"><li><i className="material-icons md-24">&#xE572;</i>Leave</li></Link>
                            </ul>
                        </div>
                    </div>
                );
                    
                }    // render of super admin
                else
                {
                    title = (
                            <Link to="/dashboardSuperAdmin" id="header-title">{this.props.companyName}</Link>
                        );
                        
                      headerMenu = (
                    <div id="header-menu">
                        <Link to="dashboardSuperAdmin/databaseManagement">Database management</Link>
						<Link to="dashboardSuperAdmin/impersonateUser">Impersonate user</Link>
                    </div>
                        );      
                   
                    headerPanel = (
                        <div id="header-panel">
                            <Link to="" id="settings-button" onClick={this.toggleDropdown}>
                                <i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
                            </Link>
                            <div id="header-dropdown" className="dropdown-content" ref="dropdownMenu">
                                <ul>
                                    <Link to="/dashboardSuperAdmin"><li>Dashboard</li></Link>
                                    <Link onClick={this.logout} to=""><li><i className="material-icons md-24">&#xE879;</i>Logout</li></Link>
                                </ul>
                            </div>
                        </div>
                    );
                }
            }
        } else {        //user not logged
            title = (
                <Link to="/" id="header-title">MaaS</Link>
            );
            headerMenu = (
                <div id="header-menu">
                    <p id="header-description">MongoDB as an Admin Service</p>
                </div>
            );
            headerPanel = (
                <div id="header-panel">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Sign Up</Link>
                </div>
            );
        }
        return (
            <div id="header">
                {title}
                {headerMenu}
                {headerPanel}
            </div>
        );
    }
});



module.exports = Header;