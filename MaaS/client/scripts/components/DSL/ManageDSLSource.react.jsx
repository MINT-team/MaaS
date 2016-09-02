// Name: {ManageDSLSource.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var Editor = require('../Editor.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');


function includeCollection(instance ,editorSession) {
    /*
    var linesNum = editorSession.getLength();
    for (var row=1;row<linesNum;row++)
    {
        
    }
    */
    var tot;
    var source = instance.state.currentDefinitionSource;
    
    
    source = source.replace(/\s/g, '');
    var macro = source.slice(0, 10);
    
    
    if (macro != "Collection")
    {
        alert('errore macro');
    }
    else
    {
        //var txt2 = txt1.slice(0, 3) + "bar" + txt1.slice(3);
        if (source[source.length-1] != "}")
        {
            alert('errore }');
        }
        else
        {
            var index = instance.state.currentDefinitionSource.indexOf("}", source.length-1);
            tot = instance.state.currentDefinitionSource.slice(0, index-1) + instance.state.includeSource 
            + instance.state.currentDefinitionSource.slice(index);
            console.log(tot);
        }
    }
}

/*
Collection(
    table: "customers",
    label: "JuniorCustomers",
    ---------id: "Junior",
    ---------Weight:"0",
    perpage: "20",
    sortby: "surname",
    order: "asc",
    query: {age: {$lt: 40}}
) {
    column(
        name: "3"
    )
    action(
        Export: "true",
        SendEmail: "true"
    )
    column(
        name: "4"
    )
    Document(
        table: "prova"
    ){
        row(
            name: "asd"
        )
        action(
            SendEmail: "true"
        )
    }   
    column(
        name: "5"
    )
}
*/


function includeDashboard() {
    
}

function getState() {
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            definitionId: DSLStore.getId(),
            definitionName: DSLStore.getName(),
            definitionType: DSLStore.getType(),
            definitionSource: DSLStore.getSource(),
            definitionDatabase: DSLStore.getDatabase(),
            currentDefinitionName: DSLStore.getCurrentDefinitionName(),
            currentDefinitionType: DSLStore.getCurrentDefinitionType(),
            currentDefinitionSource: DSLStore.getCurrentDefinitionSource(),
            currentDefinitionDatabase: DSLStore.getCurrentDefinitionDatabase(),
            includeSource: DSLStore.getIncludeSource(),
            isImpersonate: SessionStore.getImpersonate()
    };
}

var ManageDSLSource = React.createClass({
    
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    
    getInitialState: function() {
        return {
                errors: [],
                saveErrors: [],
                isLogged: SessionStore.isLogged(),
                definitionId: this.props.params.definitionId,
                definitionName: null,
                definitionType: null,
                definitionSource: DSLStore.getSource(),
                saved: this.props.params.definitionId ? true : false,
                building: false,
                currentDefinitionName: null,
                currentDefinitionType: null,
                currentDefinitionSource: null,
                currentDefinitionDatabase: this.props.location.query.databaseID,
                includeSource: null,
                include: false,
                isImpersonate: SessionStore.getImpersonate()
        };
    },

    componentDidMount: function() {
        DSLStore.addChangeListener(this._onChange);
        DSLStore.addSaveListener(this._onSave);
        DSLStore.addCompileListener(this._onCompile);
        DSLStore.addExecuteListener(this._onExecute);
        DSLStore.addIncludeListener(this._onInclude);
        if (!this.props.children)
        {
            var id = this.props.params.definitionId;
            if(id)
            {
                RequestDSLActionCreator.loadDSL(id);
            }
            if (this.props.params.mode != "view")
            {
                var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
                var editorSession = editor.getSession();
                editor.$blockScrolling = Infinity;
                editorSession.on("change", this.onEdit);
            }
        }
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
        DSLStore.removeSaveListener(this._onSave);
        DSLStore.removeCompileListener(this._onCompile);
        DSLStore.removeExecuteListener(this._onExecute);
        DSLStore.removeIncludeListener(this._onInclude);
    },
    
    componentDidUpdate: function() {
        
        if (this.state.include)
        {
            if(this.state.currentDefinitionName)
            {
                this.refs.definitionName.value = this.state.currentDefinitionName;
            }
            
            if(this.state.currentDefinitionType)
            {
                if(this.state.currentDefinitionType == "Dashboard")
                    this.refs.definitionType.selectedIndex = 1;
                if(this.state.currentDefinitionType == "Collection")
                    this.refs.definitionType.selectedIndex = 2;
                if(this.state.currentDefinitionType == "Document")
                    this.refs.definitionType.selectedIndex = 3;
                if(this.state.currentDefinitionType == "Cell")
                    this.refs.definitionType.selectedIndex = 4;
            }
            
            var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
            var editorSession = editor.getSession();
            editor.$blockScrolling = Infinity;
            editorSession.on("change", this.onEdit);
            if(this.state.currentDefinitionSource)
            {
                editor.setValue(this.state.currentDefinitionSource);
            }
            
            if (this.state.includeSource != "")
            {
                //var TokenIterator = ace.require("ace/token_iterator").TokenIterator;
                //var tokenIterator = new TokenIterator(editorSession, 0, 0);
                //tokenIterator.stepForward();
                //console.log(tokenIterator.getCurrentToken());
                includeCollection(this, editorSession);
            }
            
            this.setState({ include: false });
        }
        
    },
    
    

/*

Dashboard(
        label: "Dashboard"
    )
    {
        row(
            Document(
                table: "prova"
            )
            {
                row(
                    name: "email",
                    type: "string",
                    label: "Email"
                )
            }
            Document(
                table: "prova"
            ){
            }
        )
        row(
            Document(
                table: "prova"
            ){
            }
            Collection(
                table: "users"
            ){
            }
            Cell(
                type: "string"
            ){
            }
        )
        action(
            Export: "json"
        )
    }
    */
    
    onEdit: function(e) {
        var definitionType = this.refs.definitionType.options[this.refs.definitionType.selectedIndex].value;
        this.setState({ saved: false, currentDefinitionType: definitionType });
        if(this.refs.save && this.refs.save.classList.contains("saved"))
        {
        	this.refs.save.classList.remove("saved");
    	}
    },

    _onChange: function() {
        this.setState(getState());
        // On DSL load
        var id = this.props.params.definitionId;
        if(id)
        {
            if(this.state.definitionName)
            {
                this.refs.definitionName.value = this.state.definitionName;
            }
            if(this.state.definitionType)
            {
                if(this.state.definitionType == "Dashboard")
                    this.refs.definitionType.selectedIndex = 1;
                if(this.state.definitionType == "Collection")
                    this.refs.definitionType.selectedIndex = 2;
                if(this.state.definitionType == "Document")
                    this.refs.definitionType.selectedIndex = 3;
                if(this.state.definitionType == "Cell")
                    this.refs.definitionType.selectedIndex = 4;
            }
            var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
            if(this.state.definitionSource)
            {
                editor.setValue(this.state.definitionSource);
            }
            if (this.props.params.mode == "view")
            {
                this.refs.definitionName.disabled = true;
                this.refs.definitionType.disabled = true;
                editor.setReadOnly(true);
            }
            if(this.props.params.mode != "view")
            {
                this.setState({ saved: true });
                this.refs.save.classList.toggle("saved");
            }
        }
    },
    
    _onSave: function() {
        if (!this.props.children)
        {
            this.setState({errors: DSLStore.getErrors(), definitionId: DSLStore.getId()});
            var overwrite = false;
            if(this.props.params.mode == "edit" || (this.refs.definitionName.value != this.state.definitionName && this.state.definitionName != null))
                overwrite = true; 
            // Successful saving
            var dslId = this.state.definitionId;
            var userId = SessionStore.getUserId();
            if(!overwrite)
            {
                RequestDSLActionCreator.loadDSLAccess(dslId, userId);   // Load the new object to be visualized in the ManageDSL's table
                this.setState({definitionId: DSLStore.getId()});        // get DSL id of the new definition saved
            }
            if(this.state.saved == false)
            {
                this.setState({ saved: true });
                this.refs.save.classList.toggle("saved");
            }
            // if save was launched by a build request then build the source
            if(this.state.building)
            {
                RequestDSLActionCreator.compileDefinition(this.state.definitionId);
            }
        }
    },
    
    _onCompile: function() {
        this.setState({errors: DSLStore.getErrors()});
        if(this.state.building)
        {
            this.refs.build.classList.toggle("loader-small");
            this.setState({building: false});
            this.scrollToBottom();
        }
    },
    
    _onExecute: function() {
        this.setState({errors: DSLStore.getErrors()});
    },
    
    _onInclude: function() {
        this.setState({ include: true });
        this.setState(getState());
    },
    
    onSave: function() {
        if(this.state.saved == false)
        {
            var editor = ace.edit("editor");
            var definitionSource = editor.getValue();
            var definitionName = this.refs.definitionName.value;
            var definitionType = this.refs.definitionType.options[this.refs.definitionType.selectedIndex].value;
            var errors = [];
            if(!definitionType || !definitionName)
            {
                if (!definitionType)
                {
                    errors.push('Select the definition type before saving');
                }
                if(!definitionName)
                {
                    errors.push('Fill the definition name before saving');  
                }
            }
            else
            {
                if(definitionName == this.state.definitionName)
                    RequestDSLActionCreator.overwriteDSLDefinition(this.state.definitionId, definitionType, definitionSource, definitionName);
                else
                {
                    if (this.props.params.mode == "edit")
                    {
                        RequestDSLActionCreator.overwriteDSLDefinition(this.state.definitionId, definitionType, definitionSource, definitionName);
                    }
                    else
                    {
                        RequestDSLActionCreator.saveDSLDefinition(SessionStore.getUserId(), definitionType, definitionName, definitionSource, this.props.location.query.databaseID);
                    }
                }
                return true;
            }
            if(errors.length > 0)
            {
                this.setState({ saveErrors: errors });
                this.toggleErrorPopUp();
                return false;
            }
        }
    },
    
    onBuild: function() {
        if(!this.state.building)
        {
            this.setState({building: true});
            this.refs.build.classList.toggle("loader-small");
            if(this.state.saved == false)
            {
                var saved = this.onSave();  // save definition first
                if(!saved)
                {
                    this.setState({building: false});
                    this.refs.build.classList.toggle("loader-small");
                }
            }
            else
            {
                RequestDSLActionCreator.compileDefinition(this.state.definitionId);
            }
        }
    },
    
    onRun: function() {
        
    },
    
    onInclude: function() {
        const { router } = this.context;
        var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
        var definitionSource = editor.getValue();
        var definitionName = this.refs.definitionName.value;
        var definitionType = this.refs.definitionType.options[this.refs.definitionType.selectedIndex].value;
        RequestDSLActionCreator.saveCurrentDefinitionData(definitionName, definitionType,
        definitionSource, this.state.currentDefinitionDatabase);
        router.push('/manageDSL/manageDSLSource/include');
    },
    
    toggleErrorPopUp: function() {
		this.refs.error.classList.toggle("dropdown-show");
	},
	
	emptySaveErrors: function() {
	    this.setState({ saveErrors: [] });
	},
	
	scrollToBottom: function() {
	    var errorConsole = document.getElementById("editor-errors");
        errorConsole.scrollTop = errorConsole.scrollHeight;  
	},
    
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content, log = [], errors;
        if(this.props.children)
        {
            const childrenWithProps = React.Children.map(this.props.children,
                (child) => React.cloneElement(child, {
                    mode: "include",
                    currentDefinitionName: this.state.currentDefinitionName,
                    currentDefinitionType: this.state.currentDefinitionType,
                    currentDefinitionSource: this.state.currentDefinitionSource,
                    currentDefinitionDatabase: this.state.currentDefinitionDatabase
                })
            );
            content = childrenWithProps;
        }
        else
        {
            if(this.state.errors.length > 0) 
            {//id="errors"className="error-item"
                log = ( <div>{this.state.errors.map((error, i) => <p key={i}>{error}</p>)}</div> );
            }
            if(this.state.saveErrors.length > 0)
            {
                errors = ( <div id="errors">{this.state.saveErrors.map((error, i) => <p className="error-item" key={i}>{error}</p>)}</div> );
            }
            
            content = (
                <div id="editor-container">
                    <div className="tooltip tooltip-bottom" id="editor-back-button">
                        <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                        <p className="tooltip-text tooltip-text-short">Back</p>
                    </div>
                    <div id="editor-controls">
                        <form id="definition-name">
                            <label htmlFor="definitionName">Definition name</label>
                            <input onChange={this.onEdit} id="definitionName" type="text" ref="definitionName" placeholder="Name" />
                        </form>
                        {this.props.params.mode != "view" ?
                            <div id="editor-buttons">
                                <div className="tooltip tooltip-top">
                                    <p className="tooltip-text tooltip-text-long">Save [Alt + S]</p>
                                    <i onClick={this.onSave} id="save-button" accessKey="s" className="material-icons md-36 dropdown-button" ref="save">&#xE161;</i>
                                </div>
                                <div className="tooltip tooltip-top" ref="build">
                                    <p className="tooltip-text tooltip-text-long" ref="buildTooltip">Build [Alt + B]</p>
                                    <i onClick={this.onBuild} accessKey="b" className="material-icons md-36 dropdown-button">&#xE869;</i>
                                </div>
                                <div className="tooltip tooltip-top">
                                    <p className="tooltip-text tooltip-text-longest">Build & Run [Alt + R]</p>
                                    <i onClick={this.onRun} accessKey="r" className="material-icons md-36 dropdown-button" ref="run">&#xE037;</i>
                                </div>
                                <div className="tooltip tooltip-top">
                                    <p className="tooltip-text tooltip-text-longest">Change database</p>
                                    <Link to={"/manageDSL/externalDatabases/" + this.state.definitionId + "/changeDefinitionDatabase?databaseId=" + this.state.definitionDatabase }><i className="material-icons md-36 dropdown-button">&#xE1DB;</i></Link>
                                </div>
                                {this.state.currentDefinitionType == "Dashboard" || this.state.currentDefinitionType == "Collection" ?
                                <div className="tooltip tooltip-top">
                                    <p className="tooltip-text tooltip-text-longest">Include a definition</p>
                                    <i onClick={this.onInclude} className="material-icons md-36 dropdown-button" ref="include">&#xE14D;</i>
                                </div>
                                : ""
                                }
                            </div>
                            : ""
                        }
                        <form id="definition-type">
                            <label htmlFor="definitionType">Type</label>
                            <select onChange={this.onEdit} className="select" id="definitionType" ref="definitionType" >
                                <option value=""></option>
                                <option value="Dashboard">Dashboard</option>
                                <option value="Collection">Collection</option>
                                <option value="Document">Document</option>
                                <option value="Cell">Cell</option>
                            </select>
                        </form>
                    </div>
                    <div id="editor-viewer">
                        <Editor />
                    </div>
                    <div id="editor-errors">
                        {log}
                    </div>
                    <div className="dropdown-content dropdown-popup" ref="error">
                        <p className="dropdown-title">Error</p>
                        <div className="dropdown-description">{errors}</div>
                        <div className="dropdown-buttons">
                            <button onClick={this.emptySaveErrors} className="button">Ok</button>
                        </div>
                    </div>
                </div>
            );
        }
        
        return (
            <div id="dsl-definition">
                {content}
            </div>
        );
    }
});

module.exports = ManageDSLSource;