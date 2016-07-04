var React = require('react');
var Link = require('react-router').Link;

var Footer = React.createClass({
    render: function() {
        return (
            <div id="footer">
                <div className="footer-block">
                    <ul>
                        <li><Link to="/" id="title">MaaS</Link></li>
                        <li></li>
                    </ul>
                </div>

            </div>
            );
    }
});

module.exports = Footer;