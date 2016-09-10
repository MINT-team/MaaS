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
            activeDashboard: UserStore.getActiveDashboard(),
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
    
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
      return getState();
    },
    
    handleRedirect: function() {
        const { router } = this.context;
        if(this.state.isLogged)
        {
            if (this.props.location.pathname == "/login" || this.props.location.pathname == "/register" || this.props.location.pathname == "/")
            {
                if(this.state.user.type == "commonUser")
                {
                    if (this.state.activeDashboard == "default")
                    {
                        router.push('/manageDSL');   // redirect to DSL page
                    }
                    else if (this.state.activeDashboard)
                    {
                        router.push('/manageDSL/executeDSL/'+ this.state.activeDashboard);      // redirect to Dashboard page
                    }
                }
                else
                {
                    router.push('/dashboardSuperAdmin');
                }
            }
        }
    },
    
    componentWillMount: function() {
        this.handleRedirect();
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
    /*
    componentDidUpdate: function() {
        //this.handleRedirect();
    },
*/
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
        var content;
        if(this.state.isLogged)
        {
            if (this.props.location.pathname == "/login" || this.props.location.pathname == "/register" || this.props.location.pathname == "/")
            {
                if(this.state.user.type == "commonUser")
                {
                    content = (
                        <div>
                            <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
                                {this.props.children}
                            <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company}/>
                        </div>
                    );
                }
                else //redirect for Super Admin
                {
                    content = (
                        <div>
                            <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" userName="Super Admin" />
                                { this.props.children }
                            <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" />
                        </div>
                    );
                }
            }
            else
            {
                if(this.state.user.type == "commonUser")
                {
                    content = (
                        <div>
                            <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company} userName={this.state.user.name + " " + this.state.user.surname} />
                                {this.props.children}
                            <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName={this.state.company}/>
                        </div>
                    );
                }
                else
                {  // render of SuperAdmin or userImpersonate
                    content = (
                        <div>
                            <Header isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" userName="Super Admin" />
                                { this.props.children }
                            <Footer isLogged={this.state.isLogged} type={this.state.user.type} companyName="MaaS" />
                        </div>
                    );
                }
            }
        }
        else
        {
            if (this.props.location.pathname == "/login" || this.props.location.pathname == "/register" || this.props.location.pathname == "/")
            {
                content = (
                    <div>
                        <Header isLogged={false} />
                            {this.props.children}
                        <Footer isLogged={false} />
                    </div>
                );
            }
            else
            {
                content = (
                    <div>
                        <Header isLogged={false} />
                            <AuthorizationRequired />
                        <Footer isLogged={false} />
                    </div>
                );
            }
        }
        return (
            <div id="content">
                {content}
            </div>
        );
    }
});

module.exports = MaaSApp;