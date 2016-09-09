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
var Profile = require('./components/Profile/Profile.react.jsx');
var ChangeAvatar = require('./components/Profile/ChangeAvatar.react.jsx');
var PersonalData = require('./components/Profile/PersonalData.react.jsx');
var ChangePassword = require('./components/Profile/ChangePassword.react.jsx');
var DeleteAccount = require('./components/Profile/DeleteAccount.react.jsx');
var Company = require('./components/Company/Company.react.jsx');
var ExternalDatabases = require('./components/Company/ExternalDatabases.react.jsx');
var People = require('./components/Company/People.react.jsx');
var ManageDSL = require('./components/DSL/ManageDSL.react.jsx');
var ManageDSLSource = require('./components/DSL/ManageDSLSource.react.jsx');
var ManageDSLPermissions = require('./components/DSL/ManageDSLPermissions.react.jsx');
var ExecuteDSL = require('./components/DSL/ExecuteDSL.react.jsx');
var DeleteCompany = require('./components/Company/DeleteCompany.react.jsx');
var Editor = require('./components/Editor.react.jsx');
var Error404 = require('./components/Error404.react.jsx');
var ActiveDashboard = require('./components/Settings/ActiveDashboard.react.jsx');
var EditorConfig = require('./components/Settings/EditorConfig.react.jsx');
var DashboardSuperAdmin = require('./components/SuperAdmin/DashboardSuperAdmin.react.jsx');
var DatabaseManagement = require('./components/SuperAdmin/DatabaseManagement.react.jsx');
var CompaniesManagement = require('./components/SuperAdmin/CompaniesManagement.react.jsx');
var ChangeCompanyName = require('./components/SuperAdmin/ChangeCompanyName.react.jsx');
var ChangeUserPersonalData = require('./components/SuperAdmin/ChangeUserPersonalData.react.jsx');
var UsersManagement = require('./components/SuperAdmin/UsersManagement.react.jsx');
var ImpersonateUser = require('./components/SuperAdmin/ImpersonateUser.react.jsx');
            
var Routes = React.createClass({
  render: function() {
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
            <Route path="deleteAccount" component={DeleteAccount} />
            <Redirect from="*" to="404" />
          </Route>
          <Route path="company" component={Company}>
            <Route path="people" component={People} />
            <Route path=":userId/profile" component={Profile} />
            <Route path="deleteCompany" component={DeleteCompany} />
          </Route>
          <Route path="externalDatabases" component={ExternalDatabases} />
          <Route path="manageDSL" component={ManageDSL}>
            <Route path="externalDatabases/:mode" component={ExternalDatabases} />
            <Route path="externalDatabases/:definitionId/:mode" component={ExternalDatabases} />
            <Route path="executeDSL/:definitionId" component={ExecuteDSL} />
            <Route path="manageDSLSource" component={ManageDSLSource} >
              <Route path="include" component={ManageDSL} />
            </Route>
            <Route path="manageDSLSource/:definitionId/:mode" component={ManageDSLSource} />
            <Route path="manageDSLPermissions/:definitionId" component={ManageDSLPermissions} />
          </Route>
          <Route path="editor" component={Editor} />
          <Route path="editorConfig" component={EditorConfig} />
          <Route path="activeDashboard" component={ActiveDashboard} />
          <Route path="dashboardSuperAdmin" component={DashboardSuperAdmin} >
            <Route path="databaseManagement" component={DatabaseManagement} >
              <Route path="companiesManagement" component={CompaniesManagement} >
                <Route path="changeCompanyName/:companyId/:companyName" component={ChangeCompanyName} />
              </Route>
              <Route path="usersManagement" component={UsersManagement} >
                <Route path=":userId/profile" component={Profile} />
                <Route path="changeUserPersonalData/:userId" component={ChangeUserPersonalData} />
              </Route>
            </Route>
            <Route path="impersonateUser" component={ImpersonateUser} />
          </Route>
          <Route path="404" component={Error404} />
          <Redirect from="*" to="404" />
        </Route>
      </Router>
      );
  }
});

module.exports = Routes;