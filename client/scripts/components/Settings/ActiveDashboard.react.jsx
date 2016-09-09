var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    var userId;
    if(SessionStore.getImpersonate() == "true")
         userId = SessionStore.getUserId();  
    else userId = UserStore.getId();
    return {
            DSL_errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            DSL_LIST: DSLStore.getDSLList(),
            userId: userId
    };
}

var ManageActiveDashboard = React.createClass({
    
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
        var state = getState();
        state.sent = false;
        var currentActiveDashboard = UserStore.getActiveDashboard();
        if(currentActiveDashboard != "default")
            state.currentActiveDashboard = currentActiveDashboard;
        return state;
    },
    
    componentWillMount: function() {
        DSLStore.addChangeListener(this._onDSLChange);
        UserStore.addChangeListener(this._onUserChange);
        RequestDSLActionCreator.loadDSLList(SessionStore.getUserId());
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onDSLChange);
        UserStore.removeChangeListener(this._onUserChange);
    },
    
    _onDSLChange: function() {
        this.setState(getState());  
    },
    
    _onUserChange: function() {
        var d = UserStore.getActiveDashboard();
        this.setState({activeDashboard: d, currentActiveDashboard: d, userErrors: UserStore.getErrors()});
    },
    
    dashboardNameFormatter: function(cell, row) {
        return (
            <span className="table-link">{row.name}</span>
        );
    },
    
    unsetDashboard: function() {
        RequestUserActionCreator.changeActiveDashboard(this.state.userId, "default");
        this.setState({sent: true});
    },
    
    render: function() {
        var data = [];
        var content, name;
        var instance = this;
        if(this.state.DSL_LIST && this.state.DSL_LIST.length > 0)
        {
            this.state.DSL_LIST.forEach(function(DSL, i) {
                if(DSL.dsl.type == "Dashboard" && DSL.dsl.id != instance.state.currentActiveDashboard)
                {
                    data.push({
                        id: DSL.dsl.id,
                        name: DSL.dsl.name
                    });
                }
                if(DSL.dsl.id == instance.state.currentActiveDashboard)
                {
                    name = DSL.dsl.name;
                }
            });
        }
        
        // const { router } = this.context;
        var options = {
            noDataText: "There are no Dashboards to display",
            onRowClick: function(row){
                RequestUserActionCreator.changeActiveDashboard(instance.state.userId, row.id);
                instance.setState({sent: true});
                // router.push('/manageDSL/executeDSL/' + row.id);
            }
        };
        
        if(this.state.sent)
        {
            if(this.state.activeDashboard)
            {
                if(this.state.activeDashboard == "default")
                {
                    content = (
                        <div id="active-dashboard" className="container">
                            <p className="container-title">Active Dashboard removed!</p>
                            <div id="successful-operation">
                                <Link className="button" to="/manageDSL">Back to DSL management</Link>
                            </div>
                        </div>
                    );
                }
                else
                {
                    content = (
                        <div id="active-dashboard" className="container">
                            <p className="container-title">Active Dashboard changed!</p>
                            <div id="active-dashboard-description">
                                <p>It will appear as your home page under the name of your company</p>
                            </div>
                            <div id="successful-operation">
                                <Link className="button" to={"/manageDSL/executeDSL/"+this.state.activeDashboard}>Check it out</Link>
                            </div>
                        </div>
                    );
                }
                
            }
            else if(this.state.userErrors && this.state.userErrors.length > 0) {
                content = (
                    <div id="active-dashboard" className="container">
                        <p className="container-title">Change Active Dashboard</p>
                        <div id="active-dashboard-description">
                            <p>Error</p>
                        </div>
                        <div id="errors">
                            {this.state.userErrors}
                        </div>
                    </div>
                );
            }
            else
            {
                content = (
                    <div id="active-dashboard" className="container">
                        <p className="container-title">Change Active Dashboard</p>
                        <div id="active-dashboard-description">
                        </div>
                        <div>
                            <p className="loader"></p>
                            <p className="container-description">Changing Dashboard...</p>
                        </div>
                    </div>
                );
            }
        }
        else
        {
            if(this.state.DSL_errors && this.state.DSL_errors.length > 0)
            {
                content = (
                    <div id="active-dashboard" className="container">
                        <p className="container-title">Change Active Dashboard</p>
                        <div id="active-dashboard-description">
                            <p>Error</p>
                        </div>
                        <div id="errors">
                            {this.state.DSL_errors}
                        </div>
                    </div>
                );
            }
            else
            {
                content = (
                    <div id="active-dashboard" className="container">
                        <p className="container-title">Change Active Dashboard</p>
                        <div id="active-dashboard-description">
                            <p>Select your main Dashboard.</p>
                            <p>It will appear as your home page under the name of your company</p>
                        </div>
                        {this.state.currentActiveDashboard ?
                        <div id="current-dashboard" className="container-description">
                            <p>
                                Active Dashboard:
                                <span>{name}</span>
                                <i onClick={this.unsetDashboard} className="material-icons">&#xE5C9;</i>
                            </p>
                        </div>
                        : ""}
                        <div id="table">
                            <BootstrapTable ref="table" data={data} pagination={true} 
                                search={true} striped={true} hover={true} options={options} keyField="id">
                                <TableHeaderColumn dataField="name" dataSort={true} dataFormat={this.dashboardNameFormatter}>Name</TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                );
            }
        }
        
        return content;
    }
});

module.exports = ManageActiveDashboard;