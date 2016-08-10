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


function getState() {
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            definitionId: DSLStore.getId(),
            definitionName: DSLStore.getName(),
            definitionType: DSLStore.getType(),
            definitionSource: DSLStore.getSource()
    };
}

var ManageDSLSource = React.createClass({
    
    getInitialState: function() {
        return {
                errors: [],
                isLogged: SessionStore.isLogged(),
                definitionId: this.props.definitionId,
                definitionName: null,
                definitionSource: DSLStore.getSource(),
                saved: this.props.params.definitionId ? true : false
        };
    },

    componentDidMount: function() {
        DSLStore.addChangeListener(this._onChange);
        var id = this.props.params.definitionId;
        if(id)
        {
            RequestDSLActionCreator.loadDSL(id);
        }
        if (this.props.params.mode != "view")
        {
            var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
            var editorSession = editor.getSession();
            editorSession.on("change", this.onEdit);
        }
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },
    
    onEdit: function(e) {
        this.setState({ saved: false });
        if(this.refs.save && this.refs.save.classList.contains("saved")) {
        	this.refs.save.classList.remove("saved");
    	}
    },

    _onChange: function() {
        this.setState(getState());
        if(!(this.state.errors.length > 0))
        {
            // Successful saving
            if(this.state.saved == false)
            {
                var dslId = this.state.definitionId;
                var userId = SessionStore.getUserId();
                RequestDSLActionCreator.loadDSLAccess(dslId, userId);   // Load the new object to be visualized in the table
                this.setState({ saved: true });
                this.refs.save.classList.toggle("saved");
            }
        }
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
                    errors.push('Fill the definiton name before saving');  
                }
            }
            else
            {
                if(definitionName == this.state.definitionName)
                    RequestDSLActionCreator.overwriteDSLDefinition(this.state.definitionId, definitionType, definitionSource);
                else
                    RequestDSLActionCreator.saveDSLDefinition(SessionStore.getUserId(), definitionType, definitionName, definitionSource);
            }
            if(errors.length > 0)
            {
                this.setState({ errors: errors });
            }
        }
    },
    
    onBuild: function() {
        
    },
    
    onRun: function() {
        
    },
    
    toggleErrorPopUp: function() {
		this.refs.error.classList.toggle("dropdown-show");
	},
	
	emptyErrors: function() {
	    this.setState({ errors: [] });
	},
    
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content, errors = [];
        if(this.state.errors.length > 0) 
        {
            errors = ( <p id="errors">{this.state.errors.map((error) => <p className="error-item">{error}</p>)}</p> );
            this.toggleErrorPopUp();
        }
        content = (
            <div id="editor-container">
                <div className="tooltip tooltip-bottom" id="editor-back-button">
                    <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                    <p className="tooltip-text tooltip-text-short">Back</p>
                </div>
                <div id="editor-controls">
                    <form id="definiton-name">
                        <label htmlFor="definitionName">Definition name</label>
                        <input onChange={this.onEdit} id="definitionName" type="text" ref="definitionName" placeholder="Name" />
                    </form>
                    {this.props.params.mode != "view" ?
                        <div id="editor-buttons">
                            <div className="tooltip tooltip-top">
                                <p className="tooltip-text tooltip-text-long">Save [Alt + S]</p>
                                <i onClick={this.onSave} id="save-button" accessKey="s" className="material-icons md-36 dropdown-button" ref="save">&#xE161;</i>
                            </div>
                            <div className="tooltip tooltip-top">
                                <p className="tooltip-text tooltip-text-long">Build [Alt + B]</p>
                                <i onClick={this.onBuild} accessKey="b" className="material-icons md-36 dropdown-button" ref="build">&#xE869;</i>
                            </div>
                            <div className="tooltip tooltip-top">
                                <p className="tooltip-text tooltip-text-longest">Build & Run [Alt + R]</p>
                                <i onClick={this.onRun} accessKey="r" className="material-icons md-36 dropdown-button" ref="run">&#xE037;</i>
                            </div>
                        </div>
                        : ""
                    }
                    <form id="definition-type">
                        <label htmlFor="definitionType">Type</label>
                        <select className="select" id="definitionType" ref="definitionType" >
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
                <div className="dropdown-content dropdown-popup" ref="error">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button onClick={this.emptyErrors} className="button">Ok</button>
                    </div>
                </div>
            </div>
        );
        
        return (
            <div id="dsl-definition">
                {content}
            </div>
        );
    }
});

module.exports = ManageDSLSource;