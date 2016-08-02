var React = require('react');
var Link = require('react-router').Link;

var AuthorizationRequired = React.createClass({
    render: function() {
        return (
            <div className="container">
                <p className="container-title">Authorization required</p>
                <p className="container-description">You need to be logged in to view this page.</p>
                <Link to="/login" className="button">Go to Login</Link>
            </div>
        );
    }
});

module.exports = AuthorizationRequired;