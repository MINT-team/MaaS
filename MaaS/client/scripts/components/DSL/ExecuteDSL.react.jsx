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
            definitionType: DSLStore.getDSLData() ? DSLStore.getDSLData().definitionType : null,
            data: DSLStore.getDSLData() ? DSLStore.getDSLData().result : null,
            label: DSLStore.getDSLData() ? DSLStore.getDSLData().label : null,
            type: DSLStore.getDSLData() ? DSLStore.getDSLData().type : null,
            queried: true
    };
}

var ExecuteDSL = React.createClass({
    
    getInitialState: function() {
        return {
            errors: [],
            isLogged: SessionStore.isLogged(),
            definitonId: this.props.params.definitionId,
            data: null,
            queried: false
        };
    },
    
    componentWillMount: function() {
        DSLStore.addExecuteListener(this._onChange);
        RequestDSLActionCreator.executeDefinition(this.state.definitonId);
    },
    
    componentWillUnmount: function() {
        DSLStore.removeExecuteListener(this._onChange);
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
        
        var options = {
            hideSizePerPage : true
        };
        console.log(this.state.data);
        if(this.state.data && this.state.queried)
        {
            title = (<p className="container-title">{this.state.label}</p>);
            //console.log(this.state.data);
            var columns = [];
            
            if(this.state.data.length > 0)  // Array of table data with at least one element
            {
                data = this.state.data;
                columns = Object.keys(data[0]);
            }
            // else  // Array of table data empty
            // {
            //     columns = Object.keys(this.state.data);
            //     data.push(this.state.data);
            // }
            
            //console.log(columns);
            /*
            sizePerPageList : Array
            You can change the dropdown list for size per page if you enable pagination.
            sizePerPage : Number
            Means the size per page you want to locate as default.
            paginationSize : Number
            To define the pagination bar length, default is 5.
            hideSizePerPage : Bool
            Enable to hide the dropdown list for size per page, default is false.
            */
    
            content = (
                
                <div id="dsl-data-table">
                    <BootstrapTable ref="table" data={data} ignoreSinglePage={true} pagination={true} striped={true} hover={true} options={options} keyField={columns[0]}>
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
                    errors = (
                                <div id="errors">
                                    <p className="error-item container-title">Compilation errors</p>
                                    <Link className="button container-description" to={"/manageDSL/manageDSLSource/" + this.state.definitonId + "/edit"}>Check definiton source</Link>
                                    
                                </div> );
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