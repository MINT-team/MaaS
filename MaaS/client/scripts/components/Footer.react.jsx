var React = require('react');
var Link = require('react-router').Link;
var SessionActionCreator = require('../actions/SessionActionCreator.react.jsx');

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
					<p className="text-footer">MaaS is offer by RedBabel and develop by MINT with love. </p>
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
					<p className="text-footer">MaaS is offer by RedBabel and develop by MINT with love. </p>
				</div>
    		);

    	}

    	footerLeft = (
    		<div className="footer-left">
				<img src="../../images/RedBabelLogo.png" alt="RedBabel Logo"/>
				<p className="footer-links">
					<a href="http://redbabel.com">Home</a>
					·
					<a href="#">Contact</a>
				</p>
			</div>
    	);

    	footerRight = (
			<div className="footer-right">
				<img src="../../images/mint_logo.png" alt="MINT Logo"/>
				<p className="footer-links">
					<a href="https://github.com/MINT-team/">Home</a>
					·
					<a href="#">Contact</a>
					</p>
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