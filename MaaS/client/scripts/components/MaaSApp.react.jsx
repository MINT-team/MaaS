// Name: {MaaSApp.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../stores/SessionStore.react.jsx');
var CompanyStore = require('../stores/CompanyStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');
var Header = require('./Header.react.jsx');
var Footer = require('./Footer.react.jsx');
var AuthorizationRequired = require('./AuthorizationRequired.react.jsx');

function getState() {
    var type = SessionStore.whoIam();
    if(type == "commonUser")
    {
        return {
            isLogged: SessionStore.isLogged(),
            company: CompanyStore.getName(),
            
            user: {
            	name:	        UserStore.getName(),
            	surname:	    UserStore.getSurname(),
            	dateOfBirth:    UserStore.getDateOfBirth(),
                gender:         UserStore.getGender(),
                avatar:         UserStore.getAvatar(),
                role:           UserStore.getRole(),
                type:           type
                }
        }; 
    }
    else
    {
        return {
            isLogged: SessionStore.isLogged(),
            user: {
                type:           type
                }
        };
    }
    
}

var MaaSApp = React.createClass({
    
    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
		SessionStore.addChangeListener(this._onChange);
		UserStore.addChangeListener(this._onChange);
		UserStore.addUserLoadListener(this._onUserLoad);
		CompanyStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
    	SessionStore.removeChangeListener(this._onChange);
    	UserStore.removeChangeListener(this._onChange);
    	UserStore.removeUserLoadListener(this._onUserLoad);
		CompanyStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
    	this.setState(getState());
    },
    
    _onUserLoad: function() {
        var role = this.state.user.role;
        if(role != UserStore.getRole() && (role=="Administrator" || role=="Member" || role=="Guest") )
        {
            alert("Your role has been changed!");
        }
    },

    render: function() {
        var authorized = false;
        if(this.state.isLogged || this.props.location.pathname == "/login" || this.props.location.pathname == "/register" || this.props.location.pathname == "/")
            authorized = true;
        if(this.state.user.type == "commonUser")
        {
            return (
                <div id="content">
                    <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
                    {authorized ? this.props.children : <AuthorizationRequired />}
                    <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company}/>
                </div>
    	    );    
        }else{  // render of SuperAfmin or userImpersonate
            return (
                <div id="content">
                    <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" userName="Super Admin" />
                        {authorized ? this.props.children : <AuthorizationRequired />}
                    <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" />
                </div>
    	    );    
        }
        
    }
});

module.exports = MaaSApp;