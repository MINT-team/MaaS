var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var hashHistory = require('react-router').hashHistory;

var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
var Login = require('./components/Login.react.jsx');
var Register = require('./components/Register.react.jsx');
var RecoverPwd = require('./components/RecoverPwd.react.jsx');
var Profile = require('./components/Profile/Profile.react.jsx');
var PersonalData = require('./components/Profile/PersonalData.react.jsx');
var ChangePassword = require('./components/Profile/ChangePassword.react.jsx');
var ChangeAvatar = require('./components/Profile/ChangeAvatar.react.jsx');

var ProvaView = require('./components/ProvaView.react.jsx');

var Routes = React.createClass({
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MaaSApp}>
          <IndexRoute component={Home} />
          <Route path="provaFlux" component={ProvaView} />
          <Route path="login" component={Login} />
          <Route path="register" component={Register} />
          <Route path="recoverpwd" component={RecoverPwd} />
          <Route path="profile" component={Profile}>
            <Route path="changeAvatar" component={ChangeAvatar} />
            <Route path="personalData" component={PersonalData} />
            <Route path="changePassword" component={ChangePassword} />
          </Route>
        </Route>
      </Router>
      );
  }
});

module.exports = Routes;