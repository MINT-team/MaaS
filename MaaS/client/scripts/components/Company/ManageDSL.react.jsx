// Name: {ManageDSL.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var DashboardStore = require('../../stores/DashboardStore.react.jsx');
//var RequestDashboardActionCreator = require('../../actions/Request/RequestDashboardActionCreator.react.jsx');

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
  return {
          dashboards: DashboardStore.getDashboards()
      };
}

var ManageDSL = React.createClass({
    
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        
    },

    componentWillUnmount: function() {
        
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    render: function() {
        
    }
});

module.exports = ManageDSL;