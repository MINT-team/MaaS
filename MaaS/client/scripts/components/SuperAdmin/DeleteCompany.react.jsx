// Name: {DeleteCompany.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/SuperAdmin/}

// History:
// Version         Date            Programmer
// 1.0.0        08/08/2016        Thomas Fuser
// ==========================================

var React = require('react');
var SuperAdminStore = require('../../stores/SuperAdminStore.react.jsx');
var RequestSuperAdminActionCreator = require('../../actions/Request/RequestSuperAdminActionCreator.react.jsx');

var DeleteCompany = React.createClass({

    getInitialState: function() {
        return {
            id: this.props.id,
            name: this.props.name,
            email: this.props.email,
            errors: []
        };
    },

    componentDidMount: function() {
        SuperAdminStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        SuperAdminStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({errors: SuperAdminStore.getErrors() });
    },
    
    toggleDropdown: function(event) {
		event.preventDefault();
		if(this.state.errors.length > 0)
		{
		    this.refs.errorDropdown.classList.toggle("dropdown-show");
		}
		else
		{
		    this.refs.deleteDropdown.classList.toggle("dropdown-show");
		}
	},

    confirmDelete: function(event) {
        event.preventDefault();
        var id = this.state.id;
        var email = this.state.email;
        if(id != "")
        {
            RequestSuperAdminActionCreator.deleteCompany(id, email);
        }
        else
        {
            this.setState({ errors: "Error retrieving Company id" });
        }
    },

    render: function() {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="delete-user" className="pop-up">
                <i onClick={this.toggleDropdown} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" ref="errorDropdown">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="deleteDropdown">
                    <p className="dropdown-title">Delete Company</p>
                    <p className="dropdown-description">Are you sure you want to delete </p> 
                        <p className="dropdown-description"><span id="successful-email">{this.state.name}</span>  </p>
                    <p className="dropdown-description">company?</p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={this.confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DeleteCompany;