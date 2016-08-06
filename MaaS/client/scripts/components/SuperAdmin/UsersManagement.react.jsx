// Name: {UsersManagement.react.jsx}
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


var UsersManagement = React.createClass({
	 render: function() {
	    var content = (
	      <div>
            USER MANAGEMENT
        </div>
      );
      
    return (
      <div>
        {this.props.children || content}
      </div>
    );
  }
});

module.exports = UsersManagement;