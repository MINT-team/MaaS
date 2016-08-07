// Name: {ManageDSLPermission.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');


function getState() {
  return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            role: UserStore.getRole(),
            userId: UserStore.getId(),
            roleFilter: "All"
      };
}

var ManageDSLPermissions = React.createClass({
    getInitialState: function() {
        return getState();
    },
    
    componentDidMount: function() {
        DSLStore.addChangeListener(this._onChange);
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    buttonFormatter: function(cell, row) {
        return (
            <div className="table-buttons">
                bottoni
            </div>
        );
    },
    
    onAllClick: function() {
        this.refs.table.handleFilterData({ });
        this.setState({roleFilter: "All"});
    },
    
    onMembersClick: function() {
        /*this.refs.table.handleFilterData({
            type: ''
        });*/
        this.setState({roleFilter: "Members"});
    },
    
    onGuestsClick: function() {
        /*this.refs.table.handleFilterData({
            type: 'Guests'
        });*/
        this.setState({roleFilter: "Guests"});
    },
    
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var title,content, errors = [];
        
        // SideBar initialization
            
        var all = {
            label: "All",
            onClick: this.onAllClick,
            icon: (<i className="material-icons md-24">&#xE8EF;</i>)
        };
        var members = {
            label: "Members",
            onClick: this.onMembersClick,
            icon: (<i className="material-icons md-24">&#xE871;</i>)
        };
        var guests = {
            label: "Guests",
            onClick: this.onGuestsClick,
            icon: (<i className="material-icons md-24">list</i>)
        };
        
        var data = [];
        var selectRowProp = {
            mode: "checkbox",
            bgColor: "rgba(144, 238, 144, 0.42)"
        };
        
        var sidebarData = [all, members, guests];
        
        data = [
            {
                id: null,
                email: "Prova"
            }
        ];
        
        var options = {
            onRowClick: function(row){
                //Show user profile
            },
            noDataText: "There are no users to display"
        };
        title = "Manage DSL definition permissions";
        content = (
            <div id="manage-dsl">
                <Sidebar title="Filter users" data={sidebarData}/>
                <div className="container sidebar-container">
                    <p className="container-title">{title}</p>
                    <div id="table-top">
                        <p id="filter-type">{this.state.roleFilter}</p>
                        <div id="top-buttons">
                        
                        </div>
                    </div>
                    <div id="table">
                        <BootstrapTable ref="table" data={data} pagination={true} 
                        search={true} striped={true} hover={true} selectRow={selectRowProp} options={options} keyField="id">
                            <TableHeaderColumn dataField="email" dataSort={true}>Email</TableHeaderColumn>
                            <TableHeaderColumn dataField="role" dataSort={true}>Role</TableHeaderColumn>
                            <TableHeaderColumn dataField="buttons" dataFormat={this.buttonFormatter}></TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
            );
        return (
            <div id="dsl-definition-permissions">
                {content}
            </div>
            
        );
    }
    
});

module.exports = ManageDSLPermissions;

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
dsl1    Utente1  esecuzione
dsl1    Utente2  scrittura
dsl1    Utente3  lettura
dsl2    Utente3  esecuzione
*/

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
Permesso = 'esecuzione', 'scrittura', 'lettura'
1) Permesso di scrittura: modifica + cancellazione + lettura + esecuzione
2) Permesso di lettura: lettura + esecuzione
3) Permesso di esecuzione: esecuzione
*/