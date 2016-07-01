var React = require('react');
var Header = require('./Header.react.jsx');
var Home = require('./Home.react.jsx');

var MaaSApp = React.createClass({
    render() {
        return (
            <div id="app">
                <Header />
                {this.props.children}
            </div>
	    );
    }
});

module.exports = MaaSApp;