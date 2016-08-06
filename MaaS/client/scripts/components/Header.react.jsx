// Name: {Header.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');


var Header = React.createClass({

    componentDidMount: function() {
    	window.addEventListener('click', this.handleClick);
    },

    componentWillUnmount: function() {
    	window.removeEventListener('click', this.handleClick);
    },

	handleClick: function(event) {
	    if(!event.target.className.match("dropdown-button")) {
		    var dropdowns = document.getElementsByClassName("dropdown-content");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
		    	if (openDropdown.classList.contains("dropdown-show")) {
		        	openDropdown.classList.remove("dropdown-show");
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
                        <Link to="/company/externalDatabases">Database</Link>
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
                                <Link to="/manageDashboard"><li>Active Dashboard</li></Link>
                                <Link to="/editorConfig"><li>Text editor</li></Link>
                                <Link onClick={this.logout} to=""><li><i className="material-icons md-24">&#xE879;</i>Logout</li></Link>
                            </ul>
                        </div>
                    </div>
                );
            }
            else // render superAdmin Component
            {
                title = (
                        <Link to="/" id="header-title">{this.props.companyName}</Link>
                    );
                
                headerMenu = (
                    <div id="header-menu">
                        <Link to="/dashboardSuperAdmin">Dashboard</Link>
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
                                <Link onClick={this.logout} to=""><li>Logout</li></Link>
                            </ul>
                        </div>
                    </div>
                );
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