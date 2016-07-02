var React = require('react');
var ReactDOM = require('react-dom');
window.React = React;
var Routes = require('./routes.jsx');

ReactDOM.render(<Routes />, document.getElementById('content'));