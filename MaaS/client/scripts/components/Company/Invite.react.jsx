// Name: {Invite.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');

var Invite = React.createClass({

    getInitialState: function() {
        return {
            companyId: this.props.companyId,
            role: "Administrator",
            sent: SessionStore.getEmail() ? true : false,
            errors: []
        };
    },

    componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        SessionStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({errors: SessionStore.getErrors()});
        this.toggleDropdown();
        RequestCompanyActionCreator.getUsers(this.state.companyId);
		this.refs.email.value = "";
    },
    
    toggleDropdown: function() {
		if(this.state.errors.length > 0) {
		    this.refs.error.classList.toggle("dropdown-show");
		} else {
		    this.refs.invite.classList.toggle("dropdown-show");
		}
	},

    _onSubmit: function(event) {
        event.preventDefault();
        var name = UserStore.getName();
        var surname = UserStore.getSurname();
        var sender_email = UserStore.getEmail();
        var company = CompanyStore.getName();
        var sender;
        if(name != "" || surname != "") {
            sender = name + ' ' + surname;
        } else {
            sender = sender_email;
        }
        var role = this.state.role;
        var email = this.refs.email.value;
        if(email != "") {
            RequestSessionActionCreator.invite(sender, company, role, email);
            this.setState({sent: true});
        } else {
            this._setError("Insert an email to send invitation");
        }
    },

    _setError: function(error) {
        this.setState({ errors: error });
    },

    _onSelectChange: function(event) {
        this.setState({role: event.target.value});
    },

    render: function() {
        var errors;
        
        if(!this.state.sent || (this.state.errors.length > 0)) {
            if(this.state.errors.length > 0) {
                errors = ( <p id="errors">{this.state.errors}</p> );
            }
        }
        return (
            <div id="invite" className="table-row">
                <form onSubmit={this._onSubmit}>
                    <select id="role" className="select" onChange={this._onSelectChange}>
                        <option value="Administrator">Administrator</option>
                        <option value="Member">Member</option>
                        <option value="Guest">Guest</option>
                    </select>
                    <input type="email" placeholder="Email" ref="email" required />
                    <button id="invite-button" className="inline-button dropdown-button">Invite</button>
                </form>
                <div className="dropdown-content dropdown-popup" ref="error">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div id="invite-dropdown" className="dropdown-content dropdown-popup" ref="invite">
                    <p className="dropdown-title">Invitation sent!</p>
                    <p className="dropdown-description"></p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Ok</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Invite;