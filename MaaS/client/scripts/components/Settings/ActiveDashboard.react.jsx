// Name: {ManageDashboard.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;

var ManageActiveDashboard = React.createClass({
    
    render: function() {
        return(
            <div className="container">
                <p className="container-title">Dashboard Management</p>
                <p>Select your main Dashboard</p>
                <p>It will appear as your home page under the name of your company</p>
            
            </div>
        );
    }
});

module.exports = ManageActiveDashboard;