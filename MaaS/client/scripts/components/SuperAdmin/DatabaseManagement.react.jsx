var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var Sidebar = require('../Sidebar.react.jsx');

function getState() {
    
  return {
            errors: [],//DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            companies:  localStorage.getItem('companies')  //JSON that contains the companies in the system 
      };
}


var DatabaseManagement = React.createClass({
    
    
 getInitialState: function() {
      return getState();
  },

 componentDidMount: function() {
        SessionStore.addChangeListener(this._onChange);
        CompanyStore.addChangeListener(this._onChange);
        RequestCompanyActionCreator.getCompanies();  
  },
  
  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },
  
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) 
        {
            alert(this.state.errors);
            return (
                <AuthorizationRequired />
            );
        }
        var title, content;
        if(this.props.children)
        {
            content = this.props.children;
        }
        else
        {
            // SideBar initialization
            var companies = {
                label: "Companies",
                //onClick: onCompaniesClick,
                link: "dashboardSuperAdmin/companiesManagement",
                icon: (<i className="material-icons md-24">&#xE873;</i>)
            };
            var users = {
                label: "Users",
                //onClick: onUsersClick,
                link: "dashboardSuperAdmin/usersManagement",
                icon: (<i className="material-icons md-24">&#xE7EF;</i>)
            };
            
            var sidebarData = [companies, users];
            var numberOfCompanies;
            if(this.state.companies){
                numberOfCompanies = (JSON.parse(this.state.companies)).length;
            }
            else{
                numberOfCompanies = "please, wait ...";
            }
            content = (
                <div>
                    <Sidebar title="Database Management" data={sidebarData}/>
                    <div className="container sidebar-container">
                        <p className="container-title">In the system there are</p>
                        <p className="container-title">  {numberOfCompanies} </p>           
                        <p className="container-title">companies</p>
                        <i className="material-icons-dashboard">&#xE0AF;</i>
                    </div>
                </div>
            );
        }
        return (
            <div>
                {content}
            </div>
        );
    }
});

module.exports = DatabaseManagement;