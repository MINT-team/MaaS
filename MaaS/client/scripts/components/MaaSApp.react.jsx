var React = require('react');
var Header = require('./Header.react.jsx');
var Home = require('./Home.react.jsx');
var Sidebar = require('./Sidebar.react.jsx');

var MaaSApp = React.createClass({
    render() {
        return (
            <div id="app">
                <Header />
                {this.props.children}
                <Sidebar />
            </div>
	    );
    }
});

module.exports = MaaSApp;