var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;

var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/home.react.jsx');
var LoginPage = require('./components/LoginPage.react.jsx');

var Routes = React.createClass({
  render() {
    return (
      <Router>
        <Route path="/" handler={MaaSApp}>
          <IndexRoute component={Home} />
          <Route path="/login" component={LoginPage}/>
        </Route>
      </Router>
      );
  }
});

module.exports = Routes;
    
