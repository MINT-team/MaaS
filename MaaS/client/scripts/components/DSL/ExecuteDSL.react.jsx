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
    var data = DSLStore.getDSLData();
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            
            definitionType: data ? data.definitionType : null,
            data: data ? data.result : null,
            label: data ? data.label : null,
            perpage: data ? data.perpage : null,
            action: data ? data.action : null,
            nestedDocument: data ? data.document : null,
            types: data ? data.types : null,
            sortables: data ? data.sortables : null,
            selectables: data ? data.selectables : null,
            rawData: data ? data.rawData : null,
            queried: true
    };
}

function getNestedState() {
    var data = DSLStore.getDSLNestedData();
    return {
        definitionType: data ? data.definitionType : null,
        data: data ? data.result : null,
        action: data ? data.action : null,
        types: data ? data.types : null,
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
        DSLStore.addNestedExecuteListener(this._onNestedChange);
        RequestDSLActionCreator.executeDefinition(this.state.definitonId);
    },
    
    componentWillUnmount: function() {
        DSLStore.removeExecuteListener(this._onChange);
        DSLStore.removeNestedExecuteListener(this._onNestedChange);
    },
    
    _onChange: function() {
        this.setState(getState());
    },
    
    _onNestedChange: function() {
        this.setState(getNestedState());
    },
    
    dataFormatter: function(cell, row, formatExtraData) {
        if (formatExtraData.type == "string")
        {
            cell = cell.toString();
        }
        
        /*
        else if(formatExtraData.type == "image")
        {
            
        }
        else if (formatExtraData.type == "link")
        {
            
        }
        else if (formatExtraData.type == "date")
        {
            
        }
        else if (formatExtraData.type == "number")
        {
            
        }
        ..
        array
        object
        */
        
        if(formatExtraData.selectable)
        {
            var instance = this;
            var showDocument = function() {
                instance.setState({ label: "Document " + cell.props.children});
                console.log("raw");
                console.log(instance.state.rawData[row.index]);
                RequestDSLActionCreator.executeNestedDocument(instance.state.definitonId, instance.state.rawData[row.index], 
                instance.state.nestedDocument.identity, instance.state.nestedDocument.body);
            };
            
            cell = <span className="selectable" onClick={showDocument}>{cell}</span>;
        }
        
        return cell;
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
        
        
        if(this.state.label)
            title = (<p className="container-title">{this.state.label}</p>);
        
        if(this.state.data && this.state.queried)
        {
            var columns = [];
            if(this.state.data.length > 0)  // Array of table data with at least one element
            {
                data = this.state.data;
                columns = Object.keys(data[0]);
            }
            else  // Array of table data empty
            {
                // for a single object
                //     columns = Object.keys(this.state.data);  
                //     data.push(this.state.data);
            }
            console.log(columns);
            data.forEach(function(x, i) {
                data[i].index = i;
            });
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
            var definitionType = this.state.definitionType;
            var perpage = this.state.perpage;
            var perpageList = perpage ? [perpage, 10, 25, 30, 50] : [10, 25, 30, 50];
            var showTotal = function(start, to, total) { return <span id="total-lines">{"Lines in Collection: " + total}</span> };
            if(definitionType == "Cell" || definitionType == "Collection")
            {
                var options = {
                    hideSizePerPage : false, //definitionType=="Cell" ? true : false,
                    sizePerPage: perpage ? perpage : 10,
                    sizePerPageList: perpageList,
                    paginationShowsTotal: showTotal
                    //,onSizePerPageList: function(size) {alert("changed to: "+size);}
                };
                content = (
                    <div id="dsl-data-table" className={definitionType == "Cell" ? "cell-table-view" : definitionType=="Collection" ? "collection-table-view" : ""}>
                        <BootstrapTable ref="table" data={data} ignoreSinglePage={perpage ? false : true} pagination={true} striped={true} hover={true} options={options} keyField={columns[0]}>
                            {columns.map((column, i) =>
                                <TableHeaderColumn key={column} dataField={column} dataFormat={this.dataFormatter} 
                                formatExtraData={{type: this.state.types[i], selectable: this.state.selectables ? this.state.selectables[i] : false}}
                                dataSort={definitionType == "Cell" ? false : 
                                            definitionType == "Collection" ? 
                                                this.state.sortables[i] == true ? true : false
                                                : false }
                                dataAlign="center">{column}</TableHeaderColumn> //column.charAt(0).toUpperCase() + column.slice(1)
                            )}
                        </BootstrapTable>
                    </div>
                );
            }
            if(definitionType == "Document")
            {
                //console.log(this.state.action);
                //console.log(data[0]);
                content = (
                    <div id="dsl-data-table" className="document-table-view">
                        <table className="table table-striped table-bordered table-hover">
                            <tbody>
                                {columns.map((column) => <tr key={column} className="short-column">
                                                            <th key={column} className="">{column}</th> 
                                                            <td className="react-bs-container-body">{data[0][column]}</td>
                                                         </tr>  
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                );
            }
        }
        else
        {
            if(this.state.queried)
            {
                if(this.state.errors.length > 0) 
                {
                    errors = (
                                <div>
                                    <p className="error-item container-title">Error</p>
                                    <p className="container-description">There are some errors in your DSL definiton:</p>
                                    <div id="errors">
                                        {this.state.errors.map((error) => <p>{error}</p>)}
                                    </div>
                                    <Link className="button " to={"/manageDSL/manageDSLSource/" + this.state.definitonId + "/edit"}>Check definition source</Link>
                                </div>
                            );
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