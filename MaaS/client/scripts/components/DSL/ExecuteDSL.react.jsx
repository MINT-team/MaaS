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
            dashboardRows: data ? data.rows : null,
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

function getNestedState(label) {
    var data = DSLStore.getDSLNestedData();
    return {
        definitionType: data ? data.definitionType : null,
        data: data ? data.result : null,
        label: label,
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
        var label = this.state.nestedLabel;
        this.setState(getNestedState(label));
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
                instance.setState({ nestedLabel: "Document " + cell.props.children, queried: false });
                RequestDSLActionCreator.executeNestedDocument(instance.state.definitonId, instance.state.rawData[row._DSL_ELEMENT_INDEX], 
                instance.state.nestedDocument.identity, instance.state.nestedDocument.body);
                var onback = function(e) {
                    e.preventDefault();
                    instance.setState(getState());  // back to Collection state
                    document.getElementById('back-button').removeEventListener("click", onback);
                };
                document.getElementById('back-button').addEventListener("click", onback);
            };
            
            cell = <span className="selectable" onClick={showDocument}>{cell}</span>;
        }
        
        return cell;
    },
    
    horizontalTable: function(columns, data) {
        return (
            <table className="table table-striped table-bordered table-hover">
                <tbody>
                    {columns.map((column, i) => 
                        <tr key={"row_"+i} className="short-column">
                            <th key={"col_"+i} className="">{column}</th> 
                            <td className="react-bs-container-body">{data[0][column]}</td>
                        </tr>  
                    )}
                </tbody>
            </table>
        );  
    },
    
    verticalTable: function(columns, data, perpage, definitionType, options) {
        console.log(columns);
        console.log(data);
        console.log(perpage);
        console.log(definitionType);
        console.log(options);
        return (
            <BootstrapTable ref="table" data={data} ignoreSinglePage={perpage ? false : true} pagination={true} striped={true} hover={true} options={options} keyField={"id_"+data[0]._DSL_ELEMENT_INDEX}>
                {columns.map((column, i) =>
                    <TableHeaderColumn key={i} dataField={column} dataFormat={this.dataFormatter} 
                    formatExtraData={{type: this.state.types ? this.state.types[i] : "string", selectable: this.state.selectables ? this.state.selectables[i] : false}}
                    dataSort={definitionType == "Cell" ? false : 
                                definitionType == "Collection" ? 
                                    this.state.sortables ? (this.state.sortables[i] == true ? true : false) : false
                                    : false }
                    dataAlign="center">{column}</TableHeaderColumn>
                )}
            </BootstrapTable>  
        );  
    },
    
    togglePopUp: function(id) {
        alert("click");
        var table = document.getElementById("dsl-data-table");
        var clone = document.getElementById(id).cloneNode(true);
        table.appendChild(clone);
    },
    
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content, errors, title, action;
        var data = [];
        
        
        if(this.state.label)
            title = (<p className="container-title">{this.state.label}</p>);
        
        if((this.state.data || this.state.dashboardRows) && this.state.queried)
        {
            var perpage = this.state.perpage;
            var perpageList = perpage ? [perpage, 10, 25, 30, 50] : [10, 25, 30, 50];
            var showTotal = function(start, to, total) { return <span id="total-lines">{"Total rows: " + total}</span> };
            var options = {
                hideSizePerPage : false, //definitionType=="Cell" ? true : false,
                sizePerPage: perpage ? perpage : 10,
                sizePerPageList: perpageList,
                paginationShowsTotal: showTotal
                //,onSizePerPageList: function(size) {alert("changed to: "+size);}
            };
            if(this.state.data)
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
                //console.log(this.state.data);
                // console.log(columns);
                data.forEach(function(x, i) {
                    x._DSL_ELEMENT_INDEX = i;
                });
                var index = columns.indexOf("_DSL_ELEMENT_INDEX");
                if(index != -1)
                    columns.splice(index, 1);
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
                var definitionType = this.state.definitionType;
                if(definitionType == "Cell" || definitionType == "Collection")
                {
                    
                    content = (
                        <div id="dsl-data-table" className={definitionType == "Cell" ? "cell-table-view" : definitionType=="Collection" ? "collection-table-view" : ""}>
                            {this.verticalTable(columns, data, perpage, definitionType, options)}
                        </div>
                    );
                    // <BootstrapTable ref="table" data={data} ignoreSinglePage={perpage ? false : true} pagination={true} striped={true} hover={true} options={options} keyField={"id_"+data[0]._DSL_ELEMENT_INDEX}>
                    //             {columns.map((column, i) =>
                    //                 <TableHeaderColumn key={i} dataField={column} dataFormat={this.dataFormatter} 
                    //                 formatExtraData={{type: this.state.types[i], selectable: this.state.selectables ? this.state.selectables[i] : false}}
                    //                 dataSort={definitionType == "Cell" ? false : 
                    //                             definitionType == "Collection" ? 
                    //                                 this.state.sortables[i] == true ? true : false
                    //                                 : false }
                    //                 dataAlign="center">{column}</TableHeaderColumn> //column.charAt(0).toUpperCase() + column.slice(1)
                    //             )}
                    //         </BootstrapTable>
                }
                else if(definitionType == "Document")
                {
                    content = (
                        <div id="dsl-data-table" className="document-table-view">
                            {this.horizontalTable(columns, data)}
                        </div>
                    );
                }
                // <table className="table table-striped table-bordered table-hover">
                //                 <tbody>
                //                     {columns.map((column, i) => 
                //                         <tr key={i} className="short-column">
                //                             <th key={i} className="">{column}</th> 
                //                             <td className="react-bs-container-body">{data[0][column]}</td>
                //                         </tr>  
                //                     )}
                //                 </tbody>
                //             </table>
            }
            else if(this.state.dashboardRows)
            {
                if(this.state.definitionType == "Dashboard")
                {
                    var rows = this.state.dashboardRows;
                    
                    console.log(rows);
                    //"# "+entity.type+(entity.data.result ? " ("+entity.data.result.length+")" : "")
                    content = (
                        <div id="dsl-data-table" className="dashboard-table-view">
                            {rows.map((row, i) => 
                                <div key={"row_"+i} className="dashboard-row">
                                    {row.map((entity, j) => 
                                        <div key={"entity_"+j} id={"entity_"+j} className="dashboard-cell" onClick={this.togglePopUp.bind(this, "entity_"+j)}>
                                            {entity.data.label ? <p>{entity.data.label}</p> : ""}    
                                            {
                                                <div className="dsl-thumbnail">
                                                    {entity.type == "Document" ? 
                                                        this.horizontalTable(Object.keys(entity.data.result[0]), entity.data.result)
                                                        :
                                                        this.verticalTable(Object.keys(entity.data.result[0]), entity.data.result, entity.data.perpage, entity.type, options)}
                                                </div>
                                            }
                                        </div>
                                    )}
                                </div>  
                            )}
                        </div>
                        
                    );
                }
            }
            
            if(this.state.action)
            {
                var Export, SendEmail, instance = this;
                if(this.state.action.Export)
                {
                    var onExport = function(format) {
                        
                        var exportData = JSON.stringify(data);
                        exportData = JSON.parse(exportData);
                        exportData.forEach(function(obj) {
                            if(obj._DSL_ELEMENT_INDEX)
                            {
                                console.log("trovato");
                                delete obj._DSL_ELEMENT_INDEX;
                            }
                        });
                        exportData = JSON.stringify(data, null, 4);
                        var filename = instance.state.label + ".json";
                        var blob = new Blob([exportData], {type: 'application/json'});
                        
                        if (typeof window.navigator.msSaveBlob !== 'undefined') {
                                // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                                window.navigator.msSaveBlob(blob, filename);
                        } else {
                            var url = window.URL.createObjectURL(blob);
                            var tempLink = document.createElement('a');
                            tempLink.href = url;
                            tempLink.setAttribute('download', filename);
                            tempLink.click();
                        }
                    };
                    if(this.state.action.Export == true || this.state.action.Export == "true")
                    {
                        Export = (
                            <div>
                                <i onClick={onExport} className="dsl-download material-icons md-36">&#xE884;</i>
                            </div>
                        );
                    }
                    if(this.state.action.Export == "json")
                    {
                        Export = (
                            <div>
                            </div>
                        );
                    }
                    if(this.state.action.Export == "csv")
                    {
                        Export = (
                            <div>
                            </div>    
                        );
                    }
                }
                if(this.state.action.SendEmail)
                {
                    if(this.state.action.SendEmail == true || this.state.action.SendEmail == "true")
                    {
                        SendEmail = (
                            <div>
                            </div>
                        );
                    }
                    if(this.state.action.SendEmail == "json")
                    {
                        SendEmail = (
                            <div>
                            </div>
                        );
                    }
                    if(this.state.action.SendEmail == "csv")
                    {
                        SendEmail = (
                            <div>
                            </div>
                        );
                    }
                }
                action = (
                    <div id="dsl-action">
                        {Export}
                        {SendEmail}
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
            <div id={this.state.definitionType == "Dashboard" ? "dashboard-container" : "dsl-data-container"}>
                <div className="tooltip tooltip-bottom" id="editor-back-button">
                    <Link to="manageDSL" id="back-button"><i className="material-icons md-48">&#xE15E;</i></Link>
                    <p className="tooltip-text tooltip-text-short">Back</p>
                </div>
                {title}
                {content}
                {action}
                {errors}
            </div>
        );
    }
});

module.exports = ExecuteDSL;