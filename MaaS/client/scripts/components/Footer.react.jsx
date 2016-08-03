// Name: {Footer.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');

var Footer = React.createClass({

	logout: function() {
		var accessToken = SessionStore.getAccessToken();
		RequestSessionActionCreator.logout(accessToken);
	},

    render: function() {
		var footerLeft, footerCenter, footerRight;
    	if (this.props.isLogged) {
    		if(this.props.type == "commonUser")		
    		{
	    		footerCenter = (
	    			<div className="footer-centerLooged">
						<Link to="/company" id="header-title">{this.props.companyName}</Link>
						<p className="footer-links">
							<Link to="/" id="home"> Home </Link>
							<Link to="/company">Company</Link>
							<Link to="/company/externalDatabases">Database</Link>
							<Link to="/manageDSL">DSL</Link>
							<Link onClick={this.logout} to="">Logout</Link>
						</p>
						<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
					</div>
	    		);
	    	}else{				//if I want to render the footer of the Super Admin
	    		footerCenter = (
	    			<div className="footer-centerLooged">
						<Link to="/" id="header-title">{this.props.companyName}</Link>
						<p className="footer-links">
							<Link to="/" id="home"> Home </Link>
							<Link to="/dashboardSuperAdmin">Dashboard</Link>
							<Link onClick={this.logout} to="">Logout</Link>
						</p>
						<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
					</div>
	    		);
	    	}
    	}
    	else{		// user not logged
    		footerCenter = (
    			<div className="footer-centerUnLooged">
					<Link to="/" id="header-title">MaaS</Link>
					<p id="header-description">MongoDB as an Admin Service</p>
					<p className="footer-links">
						<Link to="/" id="home"> Home </Link>
						<Link to="/login" id="login"> Login </Link>
						<Link to="/register" id="register"> Sign Up </Link>
					</p>
					<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
				</div>
    		);

    	}
    	footerLeft = (
    		<div className="footer-left">
				<a target="_blank" href="http://redbabel.com"><img src="../../images/RedBabelLogo.png" alt="RedBabel Logo"/></a>
			</div>
    	);
    	footerRight = (
			<div className="footer-right">
				<a target="_blank" href="https://github.com/MINT-team/"><img src="../../images/mint_logo.png" alt="MINT Logo"/></a>
			</div>
    	);
        return (
        	<div id="footer">
        		{footerLeft}
			    {footerCenter}
			    {footerRight}
			</div>
        );
    }
});

module.exports = Footer;