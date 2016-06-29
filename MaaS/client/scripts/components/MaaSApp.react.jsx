var React = require('react');
var Header = require('./Header.react.jsx');
var Home = require('./Home.react.jsx');

var MaaSApp = React.createClass({
    render() {
        return (    //questo div serve altrimenti da errore
            <div id="app">   
                <Header />
                <Home />
            </div>
	    );
    }
});

module.exports = MaaSApp;