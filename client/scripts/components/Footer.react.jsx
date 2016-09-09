// Name: {Footer.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');
var CompanyStore = require('../stores/CompanyStore.react.jsx');
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');


function getState() {
    return{
        userCompany: CompanyStore.getName(),
        isImpersonate: SessionStore.getImpersonate()
    };
}

var Footer = React.createClass({
	
	getInitialState: function() {
        return  getState();
    },
	
	componentDidMount: function() {
		CompanyStore.addChangeListener(this._onChange);
    	SessionStore.addImpersonateListener(this._onChange);
    	SessionStore.addLeaveImpersonateListener(this._onLeaveImpersonate);
    },

	componentWillUnmount: function() {
		CompanyStore.removeChangeListener(this._onChange);
    	SessionStore.removeImpersonateListener(this._onChange);
		SessionStore.removeLeaveImpersonateListener(this._onLeaveImpersonate);
	},
	
	_onChange: function() {
    	this.setState(getState());
	},

	logout: function() {
		var accessToken = SessionStore.getAccessToken();
		RequestSessionActionCreator.logout(accessToken);
	},
	
	_onLeaveImpersonate: function() {
        this.setState({isImpersonate: "false"}); 
    },
    
    leaveImpersonate: function() {
	    RequestSessionActionCreator.leaveImpersonate();
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
							<Link to="/company">Company</Link>
							<Link to="/externalDatabases">Database</Link>
							<Link to="/manageDSL">DSL</Link>
							<Link onClick={this.logout} to="">Logout</Link>
						</p>
						<p>
							<a href="mailto:mint.swe.unipd@gmail.com">Any problems? Contact the Super Admin</a>
						</p>
						<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
					</div>
	    		);
	    	}else{				//if I want to render the footer of the Super Admin or a impersonate user
	    			
	    		if(this.state.isImpersonate == "true")   //render impersonate
	    		{
	    			footerCenter = (
	    			<div className="footer-centerLooged">
						<Link to="/company" id="header-title">{this.state.userCompany}</Link>
						<p className="footer-links">
							<Link to="/company">Company</Link>
							<Link to="/externalDatabases">Database</Link>
							<Link to="/manageDSL">DSL</Link>
							<Link onClick={this.leaveImpersonate} to="dashboardSuperAdmin/impersonateUser">Leave</Link>
						</p>
						<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
					</div>
	    		);
	    		}
	    		else
	    		{
		    		footerCenter = (
		    			<div className="footer-centerLooged">
							<Link to="/dashboardSuperAdmin" id="header-title">{this.props.companyName}</Link>
							<p className="footer-links">
								<Link to="/dashboardSuperAdmin">Dashboard</Link>
								<Link onClick={this.logout} to="">Logout</Link>
							</p>
							<p className="text-footer">MaaS is offered by RedBabel and developed with ❤ by MINT. </p>
						</div>
		    		);
	    		}
	    		
	    	}
    	}
    	else{		// user not logged
    		footerCenter = (
    			<div className="footer-centerUnLooged">
					<Link to="/" id="header-title">MaaS</Link>
					<p id="header-description">MongoDB as an Admin Service</p>
					<p className="footer-links">
						<Link to="/login" id="login"> Login </Link>
						<Link to="/register" id="register"> Sign Up </Link>
					</p>
					<p>
						<a href="mailto:mint.swe.unipd@gmail.com">Any problems? Contact the Super Admin</a>
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