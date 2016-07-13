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
            avatar: UserStore.getAvatar()
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

    render() {
        return (
            <div id="app">
                <Header isLogged={this.state.isLogged} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
                {this.props.children}
                <Footer />
            </div>
	    );
    }
});

module.exports = MaaSApp;