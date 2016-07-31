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

function getState() {
    return {
        isLogged: SessionStore.isLogged(),
        company: CompanyStore.getName(),
        user: {
        	name:	UserStore.getName(),
        	surname:	UserStore.getSurname(),
        	dateOfBirth: UserStore.getDateOfBirth(),
            gender: UserStore.getGender(),
            avatar: UserStore.getAvatar(),
            type: SessionStore.whoIam()   // commonUser or superAdmin
        }
    };
}

var MaaSApp = React.createClass({

    getInitialState: function() {
      return getState();
    },

    componentDidMount: function() {
		SessionStore.addChangeListener(this._onChange);
		UserStore.addChangeListener(this._onChange);
		CompanyStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
    	SessionStore.removeChangeListener(this._onChange);
    	UserStore.removeChangeListener(this._onChange);
		CompanyStore.removeChangeListener(this._onChange);
    },
    

    _onChange: function() {
    	this.setState(getState());
    },

    render: function() {
        //     return (
        //         <div id="app">
        //             <Header isLogged={this.state.isLogged} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
        //             {this.props.children}
        //             <Footer isLogged={this.state.isLogged} companyName={this.state.company}/>
        //         </div>
    	// );
        var content;
        if(this.state.user.type == "superAdmin")
        {
            content =( 
                <div id="app">
                    <Header isLogged={this.state.isLogged}  type={this.state.type} companyName="Red Babel" />
                        {this.props.children}
                    <Footer isLogged={this.state.isLogged} type={this.state.type} companyName="Red Babel" />
                </div>
                );
        }else
        {
            content =( 
                <div id="app">
                   <Header isLogged={this.state.isLogged} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
                        {this.props.children}
                   <Footer isLogged={this.state.isLogged} companyName={this.state.company}/>
               </div>
               );
        }
        return (
           content
	    );
    }
});

module.exports = MaaSApp;