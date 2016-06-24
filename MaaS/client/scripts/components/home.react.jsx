var React = require('react');

var ListItem = React.createClass({
  render: function() {
    return (
    <li className="list-group-item">
    <h4 className="list-group-item-heading">{{this.props.origin}}</h4>
    <p className="list-group-item-text">{{this.props.translation}}</p>
    </li>       
  );
  }
});

module.exports = ListItem;