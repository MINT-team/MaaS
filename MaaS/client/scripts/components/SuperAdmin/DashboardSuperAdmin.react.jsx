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


var DashboardSuperAdmin = React.createClass({
	 render: function() {
	    var content = (
	      <div className="dashCont">
          <Link className="dashElement" to="/dashboardSuperAdmin/databaseManagement"> 
              <i className="material-icons-dashboard">&#xE1DB;</i> Internal database management 
          </Link>
          <Link className="dashElement" to="/dashboardSuperAdmin/impersonateUser"> 
              <i className="material-icons-dashboard">&#xE7EF;</i>Impersonate other user 
          </Link>
        </div>
      );
      
    return (
      <div>
        {this.props.children || content}
      </div>
    );
  }
});

module.exports = DashboardSuperAdmin;