var React = require('react');
var Header = require('./Header.react.jsx');
var Footer = require('./Footer.react.jsx');

var MaaSApp = React.createClass({
    render() {
        return (
            <div id="app">
                <Header />
                {this.props.children}
                <Footer />
            </div>
	    );
    }
});

module.exports = MaaSApp;