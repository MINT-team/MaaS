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
    		title = (
    			<Link to="/company" id="header-title">{this.props.companyName}</Link>
    		);
			headerMenu = (
				<div id="header-menu">
					<Link to="/dashboard">Dashboard</Link>
					<Link to="/company/externalDatabases">Database</Link>
				</div>
    		);
	    	headerPanel = (
		    	<div id="header-panel">
					<Link to="/profile"><span id="header-user-name">{this.props.userName}</span><i className="material-icons md-36">&#xE7FD;</i></Link>
					<Link to="" id="settings-button" onClick={this.toggleDropdown}>
						<i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
					</Link>
					<div id="header-dropdown" className="dropdown-content" ref="dropdownMenu">
						<ul>
							<Link to="/manageDashboard"><li>Active Dashboard</li></Link>
							<Link to="/editor"><li>Text editor</li></Link>
							<Link to="/editorConfig"><li>Text editor</li></Link>
							<Link onClick={this.logout} to=""><li>Logout</li></Link>
						</ul>
					</div>
				</div>
			);
    	} else {
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