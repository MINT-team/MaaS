// Name: {ExecuteDSL.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged()
    };
}

var ExecuteDSL = React.createClass({
    
    getInitialState: function() {
        return getState();
    },
    
    componentWillMount: function() {
        DSLStore.addChangeListener(this._onChange);
        RequestDSLActionCreator.executeDefinition(this.props.params.definitionId);
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },
    
    _onChange: function() {
        this.setState(getState());
    },
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content;
        var data = [];
        
        data = [
            {
                id: 0,
                name: "ciao",
                type: "lol"
            },
            {
                id: 1,
                name: "ciao2",
                type: "lol"
            },
            {
                id: 2,
                name: "ciao3",
                type: "qwe"
            }
        ];
        
        
        var columns = [];
        if(data.length > 0)
        {
            columns = Object.keys(data[0]);
            // keys.forEach(function(key, i) {
            //     alert(key);
            //     columns.push();
            // });
        }
        //console.log(columns[0]);

        content = (
            
            <div id="table">
                <BootstrapTable ref="table" data={data} pagination={true} striped={true} hover={true} keyField={columns[0]}>
                    {columns.map((column) => 
                        <TableHeaderColumn key={column} dataField={column} dataSort={true}>{column.charAt(0).toUpperCase() + column.slice(1)}</TableHeaderColumn>
                    )}
                </BootstrapTable>
            </div>
            
        );
        
        
        return (
            <div id="dsl" className="container">
                {content}
            </div>
        );
    }
});

module.exports = ExecuteDSL;