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

    return (
      <div>
        <div className="dashCont" >
        <i class="material-icons md-24"></i>
         <p><i className="material-icons-dashboard">&#xE7EF;</i> </p>
        </div>
        <div className="dashCont" >
        <Link to="/dashboardSuperAdmin/impersonateUser">Impersonate other user</Link>
          <p><i className="material-icons-dashboard">&#xE7EF;</i> </p>
        </div>
      </div>

        );


    }
	});

module.exports = DashboardSuperAdmin;