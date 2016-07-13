var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Redirect = ReactRouter.Redirect;
var hashHistory = ReactRouter.hashHistory;

var MaaSApp = require('./components/MaaSApp.react.jsx');
var Home = require('./components/Home.react.jsx');
var Register = require('./components/Register.react.jsx');
var Login = require('./components/Login.react.jsx');
var ResetPwd = require('./components/ResetPwd.react.jsx');
//var RecoverPwd = require('./components/RecoverPwd.react.jsx');
var Profile = require('./components/Profile/Profile.react.jsx');
var PersonalData = require('./components/Profile/PersonalData.react.jsx');
var ChangePassword = require('./components/Profile/ChangePassword.react.jsx');
var ChangeAvatar = require('./components/Profile/ChangeAvatar.react.jsx');


//var ProvaView = require('./components/ProvaView.react.jsx');  <Route path="provaFlux" component={ProvaView} />
var Error404 = require('./components/Error404.react.jsx');

var Routes = React.createClass({
  render() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={MaaSApp}>
          <IndexRoute component={Home} />
          <Route path="login" component={Login} />
          <Route path="register" component={Register} />
          <Route path="recoverpwd" component={ChangePassword} />
          <Route path="resetpwd" component={ResetPwd} />
          <Route path="profile" component={Profile}>
            <Route path="changeAvatar" component={ChangeAvatar} />
            <Route path="personalData" component={PersonalData} />
            <Route path="changePassword" component={ChangePassword} />
            <Redirect from="*" to="404" />
          </Route>
          <Route path="404" component={Error404} />
          <Redirect from="*" to="404" />
        </Route>
      </Router>
      );
  }
});

module.exports = Routes;