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
            isLogged: SessionStore.isLogged(),
            data: DSLStore.getDSLData(),
            queried: true
    };
}

var ExecuteDSL = React.createClass({
    
    getInitialState: function() {
        return {
            errors: [],
            isLogged: SessionStore.isLogged(),
            data: null,
            queried: false
        };
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
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content, errors, title;
        var data = [];
        
        /*data = [
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
        ];*/
        
        
        if(this.state.data && this.state.queried)
        {
            title = (<p className="container-title">DSL Title</p>);
            //console.log(this.state.data);
            var columns = [];
            if(this.state.data.length > 0)
            {
                alert("data.length > 0    : "+data.length);
                data = this.state.data;
                columns = Object.keys(data[0]);
            }
            else
            {
                columns = Object.keys(this.state.data);
                data.push(this.state.data);
            }
            //console.log(columns);
    
            content = (
                
                <div id="dsl-data-table">
                    <BootstrapTable ref="table" data={data} pagination={true} striped={true} hover={true} keyField={columns[0]}>
                        {columns.map((column) => 
                            <TableHeaderColumn key={column} dataField={column} dataSort={true}>{column.charAt(0).toUpperCase() + column.slice(1)}</TableHeaderColumn> //column.charAt(0).toUpperCase() + column.slice(1)
                        )}
                    </BootstrapTable>
                </div>
                
            );
        }
        else
        {
            if(this.state.queried)
            {
                if(this.state.errors.length > 0) 
                {
                    errors = ( <div id="errors">{this.state.errors.map((error) => <p key={error} className="error-item">{error}</p>)}</div> );
                }
                else
                {
                    content = (<p className="container-description">There is no data to display</p>);
                }
            }
            else
            {
                content = (
                    <div>
                        <p className="loader"></p>
                        <p className="container-description">Querying data...</p>
                    </div>        
                );
            }
        }
        
        return (
            <div id="dsl-data-container">
                <div className="tooltip tooltip-bottom" id="editor-back-button">
                    <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                    <p className="tooltip-text tooltip-text-short">Back</p>
                </div>
                {title}
                {content}
                {errors}
            </div>
        );
    }
});

module.exports = ExecuteDSL;