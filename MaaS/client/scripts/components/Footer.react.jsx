var React = require('react');
var Link = require('react-router').Link;

var Footer = React.createClass({
    render: function() {
        return (
            <div id="footer">
                <div className="footer-block">
                    <p><Link to="/" id="footer-title">MaaS</Link></p>
                    <p>Developed by <a target="_blank" href="https://github.com/MINT-team/">MINT</a></p>

                </div>

            </div>
            );
    }
});

module.exports = Footer;