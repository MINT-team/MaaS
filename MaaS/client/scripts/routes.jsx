var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var browserHistory = ReactRouter.browserHistory;


var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
var LoginPage = require('./components/LoginPage.react.jsx');

/*var Routes = React.createClass({
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="/" component={MaaSApp}>
          <Route path="login" component={LoginPage} />
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
        <Route path="/login" component={LoginPage} />
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

