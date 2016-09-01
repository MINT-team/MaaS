// Name: {ExecuteDSL.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var ReactDOM = require('react-dom');
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
        queried: true,
        popup: null
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
                RequestDSLActionCreator.executeNestedDocument(instance.state.definitonId, formatExtraData.rawData[row._DSL_ELEMENT_INDEX], 
                formatExtraData.nestedDocument ? formatExtraData.nestedDocument.identity : {}, formatExtraData.nestedDocument ? formatExtraData.nestedDocument.body : {});
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
    
    verticalTable: function(columns, data, perpage, definitionType) {
        var table_data = data;
        var perpageList = perpage ? [perpage, 10, 25, 30, 50] : [10, 25, 30, 50];
        var showTotal = function(start, to, total) { return <span className="total-lines">{"Total rows: " + total}</span> };
        var options = {
            hideSizePerPage : false, //definitionType=="Cell" ? true : false,
            sizePerPage: perpage ? perpage : 10,
            sizePerPageList: perpageList,
            paginationShowsTotal: showTotal
            //,onSizePerPageList: function(size) {alert("changed to: "+size);}
        };
        console.log(options);
        if(data.result) {
            table_data = data.result;
        }
        table_data.forEach(function(x, i) {
            x._DSL_ELEMENT_INDEX = i;
        });
        var index = columns.indexOf("_DSL_ELEMENT_INDEX");
        if(index != -1)
            columns.splice(index, 1);
            
        return (
            <BootstrapTable ref="table" data={table_data} ignoreSinglePage={perpage ? false : true} pagination={true} striped={true} hover={true} options={options} keyField={"id_"+table_data[0]._DSL_ELEMENT_INDEX}>
                {columns.map((column, i) =>
                    <TableHeaderColumn key={i} dataField={column} dataFormat={this.dataFormatter} 
                    formatExtraData={
                        {type: this.state.types ? this.state.types[i] : data.types ? data.types[i] : "string",
                        selectable: this.state.selectables ? this.state.selectables[i] : data.selectables ? data.selectables[i] : false,
                        rawData: this.state.rawData ? this.state.rawData : data.rawData,
                        nestedDocument: this.state.nestedDocument ? this.state.nestedDocument : data.document
                        }
                    }
                    dataSort={definitionType == "Cell" ? false : 
                                definitionType == "Collection" ? 
                                    this.state.sortables ? (this.state.sortables[i] == true ? true : false) : data.sortables ? (data.sortables[i] == true ? true : false) : false
                                    : false }
                    dataAlign="center">{column}</TableHeaderColumn>
                )}
            </BootstrapTable>  
        );  
    },
    
    togglePopUp: function(id) {
        alert("pop");
        if(!this.state.popup)
        {
            this.setState({popup: id});
            var container = document.getElementById("dashboard-container");
            var entity = document.getElementById(id);
            var parent = entity.parentElement;
            
            // Epaque cell
            var cell = parent.parentElement;
            cell.classList.add("selected-cell");
            
            // Enlarge entity and save dashboard width
            var width = entity.offsetWidth;
            entity.style.width = "100%";
            
            // Create pop-up
            var modal = document.createElement("div");  // Background
            modal.setAttribute("class", "modal");
            var popup = document.createElement("div");  // White box for dsl entity
            popup.setAttribute("class", "dashboard-popup dropdown-content dropdown-show");
            var close = document.createElement("p");    // Close button
            close.setAttribute("class", "close-modal");
            close.innerHTML = "<i class=\"material-icons md-36\">&#xE5CD</i>";
            
            popup.appendChild(close);
            popup.appendChild(entity);
            modal.appendChild(popup);
            container.appendChild(modal);
    
            var instance = this;
            close.onclick = function() {
                container.removeChild(modal);
                parent.appendChild(entity);
                cell.classList.remove("selected-cell");
                instance.setState({popup: null});
                entity.style.width = width+"px";
            };
    
            window.onclick = function(event) {
                if(event.target == modal || event.target.className.match("selectable"))
                {
                    container.removeChild(modal);
                    parent.appendChild(entity);
                    cell.classList.remove("selected-cell");
                    instance.setState({popup: null});
                    entity.style.width = width+"px";
                }
            };
        }
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
                
                var definitionType = this.state.definitionType;
                if(definitionType == "Cell" || definitionType == "Collection")
                {
                    
                    content = (
                        <div id="dsl-data-table" className={definitionType == "Cell" ? "cell-table-view" : definitionType=="Collection" ? "collection-table-view" : ""}>
                            {this.verticalTable(columns, data, this.state.perpage, definitionType)}
                        </div>
                    );
                }
                else if(definitionType == "Document")
                {
                    content = (
                        <div id="dsl-data-table" className="document-table-view">
                            {this.horizontalTable(columns, data)}
                        </div>
                    );
                }
            }
            else if(this.state.dashboardRows)
            {
                if(this.state.definitionType == "Dashboard")
                {
                    var rows = this.state.dashboardRows;
                    content = (
                        <div id="dsl-data-table" className="dashboard-table-view">
                            {rows.map((row, i) => 
                                <div key={"row_"+i} className="dashboard-row">
                                    {row.map((entity, j) =>
                                        <div key={"entity_"+j} onClick={this.togglePopUp.bind(this, "entity_"+i+j)}
                                        className={"dashboard-cell dropdown-button"}>
                                            <div key={"thumb_"+j} id={"entity_"+i+j} className={"dsl-thumbnail dropdown-button " + "dashboard-"+entity.type.toLowerCase()+"-view"}>
                                                {entity.data.label ? <p className="entity-label">{entity.data.label}</p> : <p className="entity-label"></p>}
                                                {entity.type == "Document" ? 
                                                    this.horizontalTable(Object.keys(entity.data.result[0]), entity.data.result)
                                                    :
                                                    this.verticalTable(Object.keys(entity.data.result[0]), entity.data, entity.data.perpage, entity.type)}
                                            </div>
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