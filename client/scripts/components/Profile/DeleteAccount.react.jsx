var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestSessionActionCreator = require('../../actions/Request/RequestSessionActionCreator.react.jsx');

function getState() {
  return {
    userId: UserStore.getId(),
    email:  UserStore.getUser().email,
    errors: UserStore.getErrors()
  };
}

var DeleteAccount = React.createClass({

    contextTypes: {   // serve per utilizzare il router
        router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
       return {
            userId: UserStore.getId(),
            email:  UserStore.getUser().email,
            errors: []
       };
    },
    
    componentDidMount: function() {
       UserStore.addDeleteListener(this._onDelete);
    },

    componentWillUnmount: function() {
       UserStore.removeDeleteListener(this._onDelete);
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
	
	handleLogoutClick: function() {
	    this.logout();
	    const { router } = this.context;
        router.push('/');   // redirect to home page
	},

    deleteAccount: function(event) {
        event.preventDefault();
        var id = this.state.userId;
        var email = this.state.email;
        RequestUserActionCreator.deleteUser(email, id);
    },
   
    logout: function() {
		var accessToken = SessionStore.getAccessToken();
		RequestSessionActionCreator.logout(accessToken);
	},

    render: function() {
        var title = "Delete your account";
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
                    <p>Are you sure you want to remove your account from this company?</p>
                    <Link className="button" to="/profile">No</Link>
                    <Link id="delete-button" className="button" onClick={this.deleteAccount} to="/">Delete my account</Link>
                </div>
                <div className="dropdown-content dropdown-popup" ref="error">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="deleted">
                    <p className="dropdown-title">Account deleted!</p>
                    <p className="dropdown-description">Your account "<span id="successful-email">{this.state.email}</span>" has been deleted</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DeleteAccount;