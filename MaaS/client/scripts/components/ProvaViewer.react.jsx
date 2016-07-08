var React = require('react');
var Link = require('react-router').Link;

var UserActionCreator = require('../actions/UserActionCreator.react.jsx');

var ProvaViewer = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },
    _onDestroyClick: function() {
        UserActionCreator.destroy(this.props.user.id);
    },
    render: function() {
        var user = this.props.user;

        return (
          <li>
            <span>Id: {user.id}   </span>
            <span>Email: {user.email}   </span>
            <button onClick={this._onDestroyClick}>destroy(id)</button>
          </li>
        );
    }
});



module.exports = ProvaViewer;