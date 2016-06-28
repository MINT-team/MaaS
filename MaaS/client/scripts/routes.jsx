var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = ReactRouter.hashHistory;


var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
//var LoginPage = require('./components/LoginPage.react.jsx');

var Routes = React.createClass({
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MaaSApp}>
          <Route path="/asd" component={Home} />
        </Route>
      </Router>
      );
  }
});
// <IndexRoute component={Home} />
//<Route path="/login" component={LoginPage} />
module.exports = Routes;

/*
module.exports = (
  <Route path="/" component={MaaSApp}>
    <IndexRoute component={Home} />
    <Route path="/login" component={LoginPage}/>
  </Route>
  );
*/

