// Name: {DatabaseManagement.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================

 
/*var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
*/

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');



function getState() {
    
  return {
            errors: [],//DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            companies:  localStorage.getItem('companies')  //JSON that contains the companies in the system 
      };
}

var DatabaseManagement = React.createClass({
    
    
 getInitialState: function() {
      return getState();
  },

 componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
        CompanyStore.addChangeListener(this._onChange);
          
  },

  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },
    render: function() {
        window.alert("render");
        window.alert(this.state.companies);
       return(
           <div> in questo sistema ci sono  aziende </div>
           );
    }
});

module.exports = DatabaseManagement;