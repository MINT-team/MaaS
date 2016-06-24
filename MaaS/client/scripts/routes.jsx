/*var Router = require('react-router');*/
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var MaaSApp = require("./components/MaaSApp.react.jsx");
var home = require("./components/home.react.jsx");
var header = require("./components/header.react.jsx");

module.exports = (
  <Route name="app" path="/" handler={MaaSApp}>
    <DefaultRoute handler={home} />
    <Route name="asd" path="/asd" handler={header}/>
  </Route>
);