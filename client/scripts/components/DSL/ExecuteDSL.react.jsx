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

var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

function getState() {
    var data = DSLStore.getDSLData();
    console.log(data);
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
            definitionId: this.props.definitionId ? this.props.definitionId : this.props.params.definitionId,
            data: null,
            queried: false
        };
    },
    
    componentWillMount: function() {
        DSLStore.addExecuteListener(this._onChange);
        DSLStore.addNestedExecuteListener(this._onNestedChange);
        RequestDSLActionCreator.executeDefinition(this.state.definitionId);
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
        else if (formatExtraData.type == "array")
        {
            cell = this.createTableArray(cell);
        }
        else if (formatExtraData.type == "object")
        {
            cell = this.createTableObject(cell);
        }
        else if(typeof formatExtraData.type == "object" && formatExtraData.type.type == "image")
        {
            var h = formatExtraData.type.height ? formatExtraData.type.height : 100;
            var w = formatExtraData.type.width ? formatExtraData.type.width : 100;
            cell = <img width={w} height={h} src={cell} alt={"Image: "+cell}/>;
        }
        else if (typeof formatExtraData.type == "object" && formatExtraData.type.type == "link")
        {
            var label = formatExtraData.type.label ? formatExtraData.type.label : "Link";
            cell = <a className="dsl-link" href={cell} target="_blank">{label}</a>;
        }
        else if (formatExtraData.type == "date")
        {
            var d = new Date(cell);
            cell = d ? d.toDateString() : "Date error";
        }
        else if (formatExtraData.type == "number")
        {
            cell = Number(cell);
        }
        
        if(formatExtraData.selectable)
        {
            var instance = this;
            var showDocument = function() {
                instance.setState({ nestedLabel: "Document " + cell.props.children, queried: false });
                RequestDSLActionCreator.executeNestedDocument(instance.state.definitionId, formatExtraData.rawData[row._DSL_ELEMENT_INDEX], 
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
    
    createTableArray: function(array) {
        var keys = Object.keys(array);
        var values;
        if(typeof array[0] == "object")
        {
            values = Object.keys(array[0]);
        }
        else if(typeof array[0] == "string")
        {
            for (var i = 0; i < array.length; ++i)
            {
                if (array[i] !== undefined)
                {
                    array[i] = { value: array[i]};
                }
            }
            values = ["value"];
        }
        return (
            <table className="inner-table table table-striped table-bordered table-hover">
                <tbody>
                    <tr className="short-column"><th>[keys]</th>{values.map((value, i) => <th key={"head_"+i}>{value}</th>)}</tr>
                    {keys.map((k, i) =>
                        <tr key={"row_"+i} className="short-column">
                            <td>{k}</td>{values.map((value, j) => <td key={"cell_"+ j}>{array[i][value]}</td>)}
                        </tr>
                    )}
                </tbody>
            </table>
        );
    },
    
    createTableObject: function(obj) {
        var keys = Object.keys(obj);
        var instance = this;
        return (
            <table className="inner-table table table-striped table-bordered table-hover">
                <tbody>
                    {keys.map((k, i) =>
                        <tr key={"row_"+i} className="short-column">
                            <td>{k}</td><td>{Object.prototype.toString.call( obj[k] ) === '[object Array]' ?
                                                instance.createTableArray(obj[k]) : 
                                                typeof obj[k] == "object" ? instance.createTableObject(obj[k]) :
                                                obj[k] }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    },
    
    horizontalTable: function(columns, data, types) {
        var Document, rows = [];
        var instance = this;
        columns.forEach(function(column, i) {
            if(types[i] == "string")
            {
                rows.push(<td className="react-bs-container-body">{data[0][column]}</td>);
            }
            else if(types[i] == "array")
            {
                rows.push(<td className="react-bs-container-body">{instance.createTableArray(data[0][column])}</td>);
            }
            else if(types[i] == "object")
            {
                rows.push(<td className="react-bs-container-body">{instance.createTableObject(data[0][column])}</td>);
            }
            else if (types[i] == "date")
            {
                var date = new Date(data[0][column]);
                date = date ? date.toDateString() : "Date error";
                rows.push(<td className="react-bs-container-body">{date}</td>);
            }
            else if (types[i] == "number")
            {
                rows.push(<td className="react-bs-container-body">{Number(data[0][column])}</td>);
            }
            else if(typeof types[i] == "object" && types[i].type == "image")
            {
                var h = types[i].height ? types[i].height : 100;
                var w = types[i].width ? types[i].width : 100;
                rows.push(<td className="react-bs-container-body"><img width={w} height={h} src={data[0][column]} alt={"Image: "+data[0][column]}/></td>);
            }
            else if (typeof types[i] == "object" && types[i].type == "link")
            {
                var label = types[i].label ? types[i].label : "Link";
                rows.push(<td className="react-bs-container-body"><a className="dsl-link" href={data[0][column]} target="_blank">{label}</a></td>);
            }
        });
        Document = (
            <table className="table table-striped table-bordered table-hover">
                <tbody>
                    {columns.map((column, i) => 
                        <tr key={"row_"+i} className="short-column">
                            <th key={"col_"+i} className="">{column}</th> 
                            {rows[i]}
                        </tr>  
                    )}
                </tbody>
            </table>
        );
        return Document;  
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
                        dataAlign="center">
                            {column}
                    </TableHeaderColumn>
                )}
            </BootstrapTable>  
        );  
    },
    
    togglePopUp: function(id) {
        if(!this.state.popup)
        {
            this.setState({popup: id});
            var container = document.getElementById("dashboard-container");
            if(!container)
                container = document.getElementById("execute-container");
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
            close.setAttribute("class", "close-modal dropdown-button");
            close.innerHTML = "<i class=\"material-icons md-36\">&#xE5CD</i>";
            
            popup.appendChild(close);
            popup.appendChild(entity);
            modal.appendChild(popup);
            container.appendChild(modal);
    
            var instance = this;
            var onClose = function() {
                container.removeChild(modal);
                parent.appendChild(entity);
                cell.classList.remove("selected-cell");
                entity.style.width = width+"px";
                entity.blur();
                instance.setState({popup: null});
            };
            
            close.onclick = function() {
                onClose();
            };
    
            window.onclick = function(event) {
                if(event.target == modal || event.target.className.match("selectable"))
                {
                    onClose();
                }
            };
        }
    },
    
    createAction: function(action, data, label, type) {       // Export and SendEmail
        var Export, SendEmail;
        
        if(!label || label == undefined)
            label = type;
            
        var buildJSON = function() {
            var lines = JSON.stringify(data, null, 4).split('\n');
            for(var i=0; i<lines.length; i++)
            {
                if(lines[i].match("_DSL_ELEMENT_INDEX"))    // Remove dsl managing index
                {
                    lines.splice(i, 1);
                    if(lines[i-1])
                    {
                        lines[i-1] = lines[i-1].substring(0, lines[i-1].length-1);  // Remove precedent comma
                    }
                }
            }
            return lines.join('\n');
        };
        
        var buildCSV = function() {
            var content = "";    // = "data:text/csv;charset=utf-8,";
            var keys = Object.keys(data[0]);
            var index = keys.indexOf("_DSL_ELEMENT_INDEX");
            if(index != -1)
                keys.splice(index, 1);
            keys.forEach(function(k, i) {
                content += i < keys.length-1 ? k + "," : k + "\n";
            });
            for(var i=0; i<data.length; i++)
            {
                keys.forEach(function(k, j) {
                    content += j < keys.length-1 ? data[i][k] + "," :  data[i][k] + "\n";
                });
            }
            return content;
        };
        
        if(action && action.Export)
        {
            var onExport = function(format) {
                var json, csv;
                switch (format) {
                    case 'all':
                        json = buildJSON();
                        csv = buildCSV();
                        break;
                    
                    case 'json':
                        json = buildJSON();
                        break;
                    
                    case 'csv':
                        csv = buildCSV();
                        break;
                }
                
                var downloadBlob = function(blob, filename) {
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        var tempLink = document.createElement('a');
                        tempLink.href = url;
                        console.log(url);
                        tempLink.setAttribute('download', filename);
                        tempLink.click();
                    }    
                };
                var blob;
                if(json)
                {
                    blob = new Blob([json], {type: 'application/json'});
                    downloadBlob(blob, label + ".json");
                }
                if(csv)
                {
                    blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
                    downloadBlob(blob, label + ".csv");   
                }
            };
            
            if(action.Export == true || action.Export == "true")            // All format types
            {
                Export = (
                    <div className="action-export" onClick={onExport.bind(this, "all")}>
                        <span>Download JSON and CSV</span>
                        <i className="dsl-download material-icons md-36">&#xE884;</i>
                    </div>
                );
            }
            else if(action.Export != false && action.Export != "false")     // JSON or CSV
            {
                Export = (
                    <div className="action-export" onClick={onExport.bind(this, action.Export)}>
                        <span>Download {action.Export.toUpperCase()}</span>
                        <i className="dsl-download material-icons md-36">&#xE884;</i>
                    </div>
                );
            }
        }
        if(action && action.SendEmail)
        {
            var instance = this;
            var onSendEmail = function(event) {
                event.preventDefault();
                var format;
                if(action.SendEmail == true || action.SendEmail == "true")
                    format = "all";
                else if(action.SendEmail != false && action.SendEmail != "false")
                    format = action.SendEmail;
                var json, csv;
                switch (format) {
                    case 'all':
                        json = buildJSON();
                        csv = buildCSV();
                        break;
                    
                    case 'json':
                        json = buildJSON();
                        break;
                    
                    case 'csv':
                        csv = buildCSV();
                        break;
                }
                RequestDSLActionCreator.sendEmail(SessionStore.getUserId(), instance.state.definitionId, instance.refs.email.value, label, json, csv);
            };
            
            if(action.SendEmail != false && action.SendEmail != "false")          // All format types
            {
                SendEmail = (
                    <form onSubmit={onSendEmail} className="action-sendemail">
                        <input type="email" placeholder="Email" ref="email" required />
                        <span ref="shareButton">
                            <button className="share-button inline-button dropdown-button" >Share</button>
                        </span>
                    </form>
                );
            }
        }
        return (
            <div className="dsl-action">
                {Export}
                {SendEmail}
            </div>
        );
    },
    
    render: function() {
        var content, errors, title, action;
        var data = [];
        var fromManageSource = this.props.definitionId ? true : false;
        
        if(this.state.label)
            title = (<p className="container-title">{this.state.label}</p>);
        
        if((this.state.data || this.state.dashboardRows) && this.state.queried)
        {
            if(this.state.data)
            {
                window.onclick = null;  // Remove dashboard modal handler
                var columns = [];
                if(this.state.data.length > 0)  // Array of table data with at least one element
                {
                    data = this.state.data;
                    columns = Object.keys(data[0]);
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
                            {this.horizontalTable(columns, data, this.state.types)}
                        </div>
                    );
                }
            }
            else if(this.state.dashboardRows && this.state.definitionType == "Dashboard")
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
                                                this.horizontalTable(Object.keys(entity.data.result[0]), entity.data.result, entity.data.types)
                                                :
                                                this.verticalTable(Object.keys(entity.data.result[0]), entity.data, entity.data.perpage, entity.type)}
                                            {this.createAction(entity.data.action, entity.data.result, entity.data.label, entity.type)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );
            }
            action = this.createAction(this.state.action, data, this.state.label, this.state.definitionType);
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
                                    <Link className="button " to={"/manageDSL/manageDSLSource/" + this.state.definitionId + "/edit"}>Check definition source</Link>
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
            fromManageSource ?
                <div id="execute-container">
                    {title}
                    {content}
                    {action}
                    {errors}
                </div>
            :
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