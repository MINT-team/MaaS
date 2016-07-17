var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');

var Invite = React.createClass({

    getInitialState: function() {
        return {
            role: "Administrator",
            sent: false,
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
        var content, errors;
        if(!this.state.sent || (this.state.errors.length > 0)) {
            if(this.state.errors.length > 0) {
                errors = (
                  <p id="errors">{this.state.errors}</p>
                );
            }
            content = (
                <form onSubmit={this._onSubmit}>
                    <select id="role" onChange={this._onSelectChange}>
                        <option value="Administrator">Administrator</option>
                        <option value="Member">Member</option>
                        <option value="Guest">Guest</option>
                    </select>
                    <input type="text" placeholder="Email" ref="email" required />
                    <button type="email" className="inline-button">Invite</button>
                    {errors}
                </form>
            );
        } else {
            content = (
                <div id="invite-sent">Invitation sent!</div>
            );
        }
        return (
            <div id="invite" className="table-row">
                {content}
            </div>
        );
    }
});

module.exports = Invite;