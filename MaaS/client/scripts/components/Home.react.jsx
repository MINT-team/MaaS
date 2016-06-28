var ReactDOM = require('react-dom');
var React = require('react');
//var ProvaView = require('./provaView.react.jsx');

//ReactDOM.render(<ProvaView />, document.getElementById('content'));
/*ReactDOM.render(
    <h1>Ciao</h1>,
    document.getElementById('content')
);*/

var Home = React.createClass({
    render() {
        return (
            <h1>Hello</h1>
            );
    }
});

module.exports = Home;