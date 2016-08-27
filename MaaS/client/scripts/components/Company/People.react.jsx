// Name: {People.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var Sidebar = require('../Sidebar.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestCompanyActionCreator = require('../../actions/Request/RequestCompanyActionCreator.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var Invite = require('./Invite.react.jsx');
var DeleteUser = require('./DeleteUser.react.jsx');
var ChangeRole = require('./ChangeRole.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


function getState() {
  return {
          id: CompanyStore.getId(),
          name: CompanyStore.getName(),
          errors: CompanyStore.getErrors(),
          isLogged: SessionStore.isLogged(),
          role: UserStore.getRole(),
          email: UserStore.getEmail(),
          roleFilter: "All"
      };
}

var People = React.createClass({

  getInitialState: function() {
      return getState();
  },
  
  componentWillMount: function() {
    SessionStore.addChangeListener(this._onChange);
    CompanyStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    // Update user list
    RequestCompanyActionCreator.getUsers(this.state.id);
    // Needed if role has been changed for example
    RequestUserActionCreator.getUser(SessionStore.getUserId());
  },
  
  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      CompanyStore.removeChangeListener(this._onChange);
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

    // click sull'utente per vedere il profilo?
//   _onSubmit: function(event) {
//       event.preventDefault();   //evita il ricaricamento della pagina da parte della form
//       var password = this.refs.password.value;
//       var confirmation = this.refs.confermaPassword.value;
//       var id = this.state.userId;
//       var accessToken = this.state.accessToken;
//       UserActionCreator.changePassword(id, password, confirmation, accessToken);
//   },

  isLowerGrade: function(role) {
      var myRole = this.state.role;
      if(myRole == "Owner") {
        if(role == "Owner")
          return false;
        else
          return true;
      }
      if(myRole == "Administrator") {
        if(role == "Owner" || role == "Administrator")
          return false;
        else
          return true;
      }
  },
  
  emailFormatter: function(cell, row) {
    /*
      return (
          <Link to={"/manageDSL/executeDSL/" + row.id}>{row.name}</Link>
      );
      */
      return row.email;
  },
  
  buttonFormatter: function(cell, row) {
    
    
  },
  
  onAllClick: function() {
    this.refs.table.handleFilterData({ });
    this.setState({roleFilter: "All"});
  },
    
  onAdministratorsClick: function() {
    this.refs.table.handleFilterData({
        role: 'Administrator'
    });
    this.setState({roleFilter: "Administrators"});
  },
    
  onMembersClick: function() {
    this.refs.table.handleFilterData({
        role: 'Member'
    });
    this.setState({roleFilter: "Members"});
  },
    
  onGuestsClick: function() {
    this.refs.table.handleFilterData({
        role: 'Guest'
    });
    this.setState({roleFilter: "Guests"});
  },

  deleteAllSelected: function() {
    //alert(this.refs.table.state.selectedRowKeys);
  },
  
  render: function() {

    if(!this.state.isLogged || this.state.errors.length > 0 || !this.props.users) 
    {
        return (
            <AuthorizationRequired />
        );
    }
    
    var title, content;
    
    var all = {
        label: "All",
        onClick: this.onAllClick,
        icon: (<i className="material-icons md-24">&#xE8EF;</i>)
    };
    var administrators = {
        label: "Administrators",
        onClick: this.onAdministratorsClick,
        icon: (<i className="material-icons md-24">&#xE871;</i>)
    };
    var members = {
        label: "Members",
        onClick: this.onMembersClick,
        icon: (<i className="material-icons md-24">list</i>)
    };
    var guests = {
        label: "Guests",
        onClick: this.onGuestsClick,
        icon: (<i className="material-icons md-24">&#xE873;</i>)
    };
    
    var data = [];
    var selectRowProp = {
        mode: "checkbox",
        bgColor: "rgba(144, 238, 144, 0.42)"
    };
    
    var sidebarData = [all, administrators, members, guests];
    
    var options = {
        noDataText: "There are no users to display"
    };
    
    data = [
      {
        id: 1,
        email: 'asd@gmail.com',
        role: 'Guest',
        name: 'Cancaro',
        surname: 'Man'
      }
    ];
    
    if(this.props.users.length > 1)
    {
      
      title = "Users of your Company";
      content = (
        <div id="manage-people">
            <Sidebar title="Filter users" data={sidebarData}/>
            <div className="container sidebar-container">
                <p className="container-title">{title}</p>
                <div id="table-top">
                    <p id="filter-role">{this.state.roleFilter}</p>
                    {this.state.role == "Administrator" || this.state.role == "Owner" ?
                        <div className="top-buttons">
                            <div className="tooltip tooltip-bottom" id="deleteAll-button">
                                <i onClick={this.deleteAllSelected} className="material-icons md-48">&#xE92B;</i>
                                <p className="tooltip-text tooltip-text-long">Delete all selected users</p>
                            </div>
                        </div>
                    : "" }
                </div>
                <div id="table">
                    <BootstrapTable ref="table" data={data} pagination={true} 
                    search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                        <TableHeaderColumn dataField="email" dataSort={true} dataFormat={this.emailFormatter} >Email</TableHeaderColumn>
                        <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField="surname" dataSort={true}>Surname</TableHeaderColumn>
                        <TableHeaderColumn dataField="role" dataSort={true}>Role</TableHeaderColumn>
                        <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        </div>
      );
        
    }
    else
    {
        title = "Invite someone to your company";
        content = (
            <div id="successful-operation">
                <p>You created your company, now it's time to invite someone to collaborate in your work.</p>
                <p>Choose the role and insert the email to send the invitation</p>
                <Invite companyId={this.state.id} />
                <ul id="role-explaination">
                  <li>
                    <span className="role">Administrator:</span>
                    <span className="role-description">Can execute all operation like you.</span>
                  </li>
                  <li>
                    <span className="role">Member:</span>
                    <span className="role-description">Is possible to select which operation are allowed.</span>
                  </li>
                  <li>
                    <span className="role">Guest:</span>
                    <span className="role-description">Can only read some information.</span>
                  </li>
                </ul>
            </div>
        );
    }
    return (
      <div id="people">
        {content}
      </div>
    );
  }
});

module.exports = People;

/*



title = "Users of your Company";
        if(this.state.role == "Owner" || this.state.role == "Administrator") 
        {
          content = (
            <div className="table-content">
                <div className="table-header">
                    <span className="table-column-small"></span>
                    <span className="table-column-normal">Name</span>
                    <span className="table-column-normal">Surname</span>
                    <span className="table-column-normal">Role</span>
                    <span className="table-spacing"></span>
                    <span className="table-column-big">Email</span>
                    <span className="table-spacing"></span>
                </div>
                {this.props.users.map((u) =>
                  <div className="table-row" id={this.state.email==u.email ? "user-profile" : ""}> 
          					<span className="table-column-small">
          					  {u.avatar?
          					    <img src={"../../../images/"+u.avatar} /> :
          					    <i className="material-icons md-36 table-row-icon">&#xE851;</i>}
          					</span>
          					<span className="table-column-normal">{u.name}</span>
          					<span className="table-column-normal">{u.surname}</span>
          					<span className="table-column-normal">{u.role}</span>
          					{this.isLowerGrade(u.role) ? <ChangeRole email={u.email} role={u.role} companyId={this.state.id}/> : <span className="table-spacing"></span>}
          					<span className="table-column-big">{u.email}</span>
          					{this.isLowerGrade(u.role) ? <DeleteUser email={u.email} /> : <span className="table-spacing"></span>}
          				</div>
      			    )}
			          <Invite companyId={this.state.id}/>
            </div>
          );
        }
        else
        {
          content = (
            <div className="table-content">
                <div className="table-header">
                    <p className="table-column-small"></p>
                    <span className="table-column-normal">Name</span>
                    <span className="table-column-normal">Surname</span>
                    <span className="table-column-normal">Role</span>
                    <span className="table-column-big">Email</span>
                </div>
                {this.props.users.map((u) =>
                  <div className="table-row">
          					<span className="table-column-small">
          					  {u.avatar?
          					    (<img src={"../../../images/"+u.avatar} />) :
          					    (<i className="material-icons md-36 table-row-icon">&#xE851;</i>)}
          					</span>
          					<span className="table-column-normal">{u.name}</span>
          					<span className="table-column-normal">{u.surname}</span>
          					<span className="table-column-normal">{u.role}</span>
          					<span className="table-column-big">{u.email}</span>
          				</div>
      			    )}
            </div>
          );
        }



*/
/*

return (
      <div className="container sidebar-container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );

*/