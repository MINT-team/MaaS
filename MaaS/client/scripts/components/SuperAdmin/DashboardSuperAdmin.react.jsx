// Name: {DashboardSuperAdmin.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

function getState() {
    
  return {
            isLogged: SessionStore.isLogged(),
            userType: SessionStore.whoIam()
      };
}

var DashboardSuperAdmin = React.createClass({
  
   getInitialState: function() {
      return getState();
  },

  
	 render: function() {
	    var content = (
	      <div className="dashCont">
          <Link className="dashElement" to="/dashboardSuperAdmin/databaseManagement"> 
              <i className="material-icons-dashboard">&#xE1DB;</i> Internal database management 
          </Link>
          <Link className="dashElement" to="/dashboardSuperAdmin/impersonateUser"> 
              <i className="material-icons-dashboard">&#xE572;</i>Impersonate other user 
          </Link>
        </div>
      );
    
    if(this.state.userType != "superAdmin" || !this.state.isLogged)
    {
      
      return (
        <AuthorizationRequired />
        );
    }
    else
    {
       return (
      <div>
        {this.props.children || content}
      </div>
    );
    }
  }
});

module.exports = DashboardSuperAdmin;