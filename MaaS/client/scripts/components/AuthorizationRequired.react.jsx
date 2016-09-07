var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../stores/SessionStore.react.jsx');

function getState() {
    return {
        isLogged: SessionStore.isLogged()
    };
}

var AuthorizationRequired = React.createClass({
    
    getInitialState: function() {
        return getState();
    },
    
    render: function() {
        
        if(this.state.isLogged)
        {
            return (
            <div className="container">
                <p className="container-title">Authorization required</p>
                <p className="container-description">You aren't a super administrator so you can't display this page.</p>
            </div>
            );
        }else
        {
            return (
                <div className="container">
                    <p className="container-title">Authorization required</p>
                    <p className="container-description">You need to be logged in to view this page.</p>
                    <Link to="/login" className="button">Go to Login</Link>
                </div>
            );
        }
    }
});

module.exports = AuthorizationRequired;