var React = require('react');
var Link = require('react-router').Link;

var Footer = React.createClass({
    render: function() {
        return (
        	<footer className="footer-distributed">

			<div className="footer-left">

				<h3>Company<span>logo</span></h3>

				<p className="footer-links">
					<a href="#">Home</a>
					·
					<a href="#">Blog</a>
					·
					<a href="#">Pricing</a>
					·
					<a href="#">About</a>
					·
					<a href="#">Faq</a>
					·
					<a href="#">Contact</a>
				</p>

				<p className="footer-company-name">Company Name &copy; 2015</p>
			</div>

			<div className="footer-center">

				<div>
					<i className="fa fa-map-marker"></i>
					<p><span>21 Revolution Street</span> Paris, France</p>
				</div>

				<div>
					<i className="fa fa-phone"></i>
					<p>+1 555 123456</p>
				</div>

				<div>
					<i className="fa fa-envelope"></i>
					<p><a href="mailto:support@company.com">support@company.com</a></p>
				</div>

			</div>

			<div className="footer-right">

				<p className="footer-company-about">
					<span>About the company</span>
					Lorem ipsum dolor sit amet, consectateur adispicing elit. Fusce euismod convallis velit, eu auctor lacus vehicula sit amet.
				</p>


			</div>

		</footer>

            );
    }
});

module.exports = Footer;