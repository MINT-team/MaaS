/*window.React = React;
var routes = require("./routes.jsx");

ReactDOM.render(<Router>{routes}</Router>, document.getElementById('content'));*/

var React = require('react');
var ReactDOM = require('react-dom');
var ProvaView = require('./components/provaView.react.jsx');

ReactDOM.render(<ProvaView />, document.getElementById('content'));

/*ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('content')
);*/