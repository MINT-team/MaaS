// Name: {Delete.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// 1.0.0        27/07/2016      Fabiano Tavallini
// ==========================================

var React = require('react');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
//var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

var Delete = React.createClass({

    getInitialState: function() {
        return {
            id: UserStore.getId(),
            errors: []
        };
    },

    componentDidMount: function() {
        CompanyStore.addChangeListener(this._onChange);
        UserStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        CompanyStore.removeChangeListener(this._onChange);
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        alert("change");
        this.setState({errors: CompanyStore.getErrors() || UserStore.getErrors()});
    },

    _onClick: function(event) {
        event.preventDefault();
        var email = this.props.email;
        var id = this.state.id;
        if(email != "" || id != "") {
            RequestUserActionCreator.deleteUser(email, id);
        } else {
            this.setState({ errors: "Error retrieving user id" });
        }
    },

    render: function() {
        var errors;
        
            alert(this.state.errors.length);
        if(this.state.errors.length > 0) {
            errors = (
              <p id="delete-user-errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="delete-user">
                <i onClick={this._onClick} className="material-icons md-24">&#xE5C9;</i>
                {errors}
            </div>
        );
    }
});

module.exports = Delete;