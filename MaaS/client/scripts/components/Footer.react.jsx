var React = require('react');
var Link = require('react-router').Link;

var Footer = React.createClass({
    render: function() {
        return (
        	<div id="footer">
				<div className="footer-left">
					<img src="../../images/RedBabelLogo.png" alt="RedBabel Logo" height="40"
	width="210"/>
					<p className="footer-links">
						<a target="_black" href="http://redbabel.com">Home</a>
						·
						<a href="#">Contact</a>
					</p>
				</div>

			<div className="footer-center">
				<div>
					<p>Maas is offered by RedBabel and developed by MINT with love.</p>
				</div>
			</div>

			<div className="footer-right">
				<img src="../../images/mint_logo.png" alt="MINT Logo" height="90"
	width="200"/>
				<p className="footer-links">
				<a target="_black" href="https://github.com/MINT-team/">Home</a>
				·
				<a href="#">Contact</a>
				</p>
			</div>
	</div>

            );
    }
});

module.exports = Footer;