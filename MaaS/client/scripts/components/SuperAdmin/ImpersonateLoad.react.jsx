// Name: {ManageDSL.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');




var ImpersonateLoad = React.createClass({
    
    contextTypes: {   // serve per utilizzare il router
      router: React.PropTypes.object.isRequired
    },
    
    componentWillMount: function() {
         SessionStore.addChangeListener(this._onChange);  //
        SessionStore.addImpersonateListener(this._onChange);  //
        UserStore.addChangeListener(this._onChange);  //
        UserStore.addAllUsersLoadListener(this._onChange); //
        UserStore.addUserLoadListener(this._onChange); //
        CompanyStore.addChangeListener(this._onChange); //
       
    },
    
    componentWillUnmount: function() {
        SessionStore.removeChangeListener(this._onChange);  //
        SessionStore.removeImpersonateListener(this._onChange); //
        UserStore.removeChangeListener(this._onChange);  //
        UserStore.removeUserLoadListener(this._onChange);  //
        UserStore.removeAllUsersLoadListener(this._onChange); //
        CompanyStore.removeChangeListener(this._onChange); //
    },
    
    
    _onChange: function() {
        const { router } = this.context;
	    router.push('/manageDSL');   
    },   
    
    render: function() {
        
        return(
            <div id="dsl-data-container">
                <p className="loader"></p>
                <p className="container-description">Please wait while fetching user data...</p>
            </div> 
        );
        
    }
});

module.exports = ImpersonateLoad;