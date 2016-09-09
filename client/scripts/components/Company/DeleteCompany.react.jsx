var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');

function getState() {
  return {
    companyId: CompanyStore.getId(),
    name: CompanyStore.getName(),
    email:  UserStore.getUser().email,
    errors: CompanyStore.getErrors()
  };
}

var DeleteCompany = React.createClass({
    
    contextTypes: {   // serve per utilizzare il router
        router: React.PropTypes.object.isRequired
    },

    getInitialState: function() {
       return {
            companyId: CompanyStore.getId(),
            name: CompanyStore.getName(),
            email:  UserStore.getUser().email,
            errors: []
       };
    },

    componentDidMount: function() {
       CompanyStore.addDeleteListener(this._onDelete);
    },

    componentWillUnmount: function() {
       CompanyStore.removeDeleteListener(this._onDelete);
       window.removeEventListener('click', this.handleLogoutClick);
    },

    _onDelete: function() {
        this.setState(getState());
        this.toggleDropdown();
        if(this.state.errors.length <= 0)
            window.addEventListener('click', this.handleLogoutClick);
    },
   
    toggleDropdown: function() {
		if(this.state.errors.length > 0) {
		    this.refs.error.classList.toggle("dropdown-show");
		} else {
		    this.refs.deleted.classList.toggle("dropdown-show");
		}
	},
	
	handleLogoutClick: function() { // logout of users form the front-end platform + redirect to homepage
	    this.logout();
	    const { router } = this.context;
        router.push('/');   // redirect to home page
	},
	
	logout: function() {
		var accessToken = SessionStore.getAccessToken();
		RequestSessionActionCreator.logout(accessToken);
	},

    deleteCompany: function(event) {
        event.preventDefault();
        var id = this.state.companyId;
        var email = this.state.email;
        RequestCompanyActionCreator.deleteCompany(id, email);
    },

    render: function() {
        var title = "Delete your company";
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
                <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div className="container sidebar-container">
                <p className="container-title">{title}</p>
                <div id="successful-operation">
                    <p>Are you sure you want to remove your company?</p>
                    <p>All users collaborating and all DSL defined in it will be lost</p>
                    <Link className="button" to="/company">No</Link>
                    <Link id="delete-button" className="button" onClick={this.deleteCompany} to="/">Delete my company</Link>
                </div>
                <div className="dropdown-content dropdown-popup" ref="error">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="deleted">
                    <p className="dropdown-title">Company deleted!</p>
                    <p className="dropdown-description">Your company "<span id="successful-email">{this.state.name}</span>" has been deleted</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DeleteCompany;