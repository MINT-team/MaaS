// Name: {app.jsx}
// Module: {Front-end}
// Location: {/MaaS/client/scripts}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var ReactDOM = require('react-dom');

window.React = React;
var Routes = require('./routes.jsx');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
var App = React.createClass({
    render: function() {
    return (<Routes/>);
    }
});

ReactDOM.render(<App />, document.getElementById('app'));