var React = require('react');
var Link = require('react-router').Link;
var SessionActionCreator = require('../actions/SessionActionCreator.react.jsx');


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
		var accessToken = sessionStorage.getItem('accessToken');
		SessionActionCreator.logout(accessToken);
	},

    render: function() {
    	var title;
    	var headerMenu;
    	var headerPanel;
    	if (this.props.isLogged) {
    		title = (
    			<Link to="/" id="header-title">{this.props.companyName}</Link>
    		);
			headerMenu = (
				<div id="header-menu">
					<Link to="">Dashboard</Link>
					<Link to="">Altro</Link>
				</div>
    		);
	    	headerPanel = (
		    	<div id="header-panel">
					<Link to="/profile" ><span id="header-user-name">{this.props.userName}</span><i className="material-icons md-36">&#xE7FD;</i></Link>
					<Link to="" id="settings-button" onClick={this.toggleDropdown}>
						<i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
					</Link>
					<div className="dropdown-content" ref="dropdownMenu">
						<ul>
							<Link to=""><li>Active Dashboard</li></Link>
							<Link to=""><li>Text editor</li></Link>
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