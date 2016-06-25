var React = require('react');
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var MaaSApp = require('./components/MaaSApp.react.jsx');
var home = require('./components/home.react.jsx');
var LoginPage = require('./components/LoginPage.react.jsx');


module.exports = (
  <Route path="app" path="/" handler={MaaSApp}>
    <DefaultRoute handler={home} />
    <Route path="login" path="/login" handler={LoginPage}/>
  </Route>
);