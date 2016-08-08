// Name: {Delete.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// 1.0.0        27/07/2016      Fabiano Tavallini
// ==========================================

var React = require('react');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');

var ChangeRole = React.createClass({

    getInitialState: function() {
        return {
            active: false,  // used to show errors only for active forms
            companyId: this.props.companyId,
            id: UserStore.getId(),
            role: this.props.role,
            errors: []
        };
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        if(this.state.role == "Administrator")
            this.refs.role.options.selectedIndex = 0;
        else if(this.state.role == "Member")
            this.refs.role.options.selectedIndex = 1;
        else if(this.state.role == "Guest")
            this.refs.role.options.selectedIndex = 2;
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({errors: UserStore.getErrors()});
        this.toggleDropdown();
    },
    
    toggleDropdown: function() {
		if(this.state.active && this.state.errors.length > 0) {
		    this.refs.errorDropdown.classList.toggle("dropdown-show");
		} else {
    	    this.setState({active: false});
            RequestCompanyActionCreator.getUsers(this.state.companyId);
		}
	},
	
	toggleChangeRoleDropdown: function() {
	    this.setState({active: true});
	    this.refs.changeRoleDropdown.classList.toggle("dropdown-show");
	},

    changeRole: function(event) {
        event.preventDefault();
        var email = this.props.email;
        var role = this.state.role;
        var id = this.state.id;
        if(email != "" || id != "" || role != "") {
            RequestUserActionCreator.changeRole(email, role, id);
        } else {
            this.setState({ errors: "Error retrieving some information" });
        }
    },
    
    _onSelectChange: function(event) {
        this.setState({role: event.target.value});
    },

    render: function() {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="change-role" className="pop-up">
                <i onClick={this.toggleChangeRoleDropdown} className="material-icons md-24 dropdown-button">&#xE254;</i>
                <div className="dropdown-content dropdown-popup" ref="errorDropdown">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div id="change-role-dropdown" className="dropdown-content dropdown-popup" ref="changeRoleDropdown">
                    <p className="dropdown-title">Change role</p>
                    <p className="dropdown-description">Choose the new role for <span id="successful-email">{this.props.email}</span>
                        <select id="role" className="select dropdown-button" onChange={this._onSelectChange} ref="role">
                            <option value="Administrator">Administrator</option>
                            <option value="Member">Member</option>
                            <option value="Guest">Guest</option>
                        </select>
                    </p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="confirm-button" className="inline-button" onClick={this.changeRole}>Change</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ChangeRole;