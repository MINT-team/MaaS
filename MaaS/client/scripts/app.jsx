var React = require('react');
var ReactDOM = require('react-dom');
window.React = React;
var Routes = require('./routes.jsx');
var MuiThemeProvider = require('material-ui').MuiThemeProvider;
var getMuiTheme = require('material-ui/styles/getMuiTheme');
var darkBaseTheme = require('material-ui/styles/baseThemes/darkBaseTheme');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var App = React.createClass({
    render: function() {
    return (
        <MuiThemeProvider>
            <Routes/>
        </MuiThemeProvider>
    );
    }
});

ReactDOM.render(<App />, document.getElementById('content'));