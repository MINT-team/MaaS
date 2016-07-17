var React = require('react');
var Link = require('react-router').Link;
var RequestSessionActionCreator = require('../actions/Request/RequestSessionActionCreator.react.jsx');

var Footer = React.createClass({

	logout: function() {
		var accessToken = sessionStorage.getItem('accessToken');
		SessionActionCreator.logout(accessToken);
	},

    render: function() {
		var footerLeft, footerCenter, footerRight;
    	if (this.props.isLogged) {
    		footerCenter = (
    			<div className="footer-centerLooged">
					<Link to="/company" id="header-title">{this.props.companyName}</Link>
					<p className="footer-links">
						<Link to="/" id="home"> Home </Link>
						·
						<Link onClick={this.logout} to="">Logout</Link>
					</p>
					<p className="text-footer">MaaS is offered by RedBabel and developed with love by MINT. </p>
				</div>
    		);
    	}
    	else{
    		footerCenter = (
    			<div className="footer-centerUnLooged">
					<Link to="/" id="header-title">MaaS</Link>
					<p id="header-description">MongoDB as an Admin Service</p>
					<p className="footer-links">
						<Link to="/" id="home"> Home </Link>
						·
						<Link to="/login" id="login"> Login </Link>
						·
						<Link to="/register" id="register"> Sign Up </Link>
					</p>
					<p className="text-footer">MaaS is offered by RedBabel and developed with love by MINT. </p>
				</div>
    		);

    	}
    	footerLeft = (
    		<div className="footer-left">
				<a href="http://redbabel.com"><img src="../../images/RedBabelLogo.png" alt="RedBabel Logo"/></a>
			</div>
    	);
    	footerRight = (
			<div className="footer-right">
				<a href="https://github.com/MINT-team/"><img src="../../images/mint_logo.png" alt="MINT Logo"/></a>
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