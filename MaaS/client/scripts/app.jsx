/*window.React = React;
var routes = require("./routes.jsx");

ReactDOM.render(<Router>{routes}</Router>, document.getElementById('content'));*/

var React = require('react');

var ListItem = require('./components/provaView.react.jsx');

React.render(<ListItem />, document.body);