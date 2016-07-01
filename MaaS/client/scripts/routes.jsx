var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;


var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
var Login = require('./components/Login.react.jsx');
var Register = require('./components/Register.react.jsx');
var RecoverPwd = require('./components/RecoverPwd.react.jsx');
var Profile = require('./components/Profile.react.jsx');

/*var Routes = React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MaaSApp}>
          <Route path="login" component={Login} />
        </Route>
      </Router>
      );
  }
});*/

var Routes = React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MaaSApp} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/home" component={Home} />
        <Route path="/profile" component={Profile} />
        <Route path="/recoverpwd" component={RecoverPwd} />
      </Router>
      )
  }
});

module.exports = Routes;

/*
module.exports = (
  <Route path="/" component={MaaSApp}>
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginPage}/>
  </Route>
  );
*/
