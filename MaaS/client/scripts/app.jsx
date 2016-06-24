window.React = React;
var routes = require("./routes.jsx");

ReactDOM.render(<Router>{routes}</Router>, document.getElementById('content'));