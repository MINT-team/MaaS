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

/*
Visualizzare in sola lettura il codice del DSL
Modificare il codice del DSL
Creare un nuovo DSL
Fare una copia di un DSL
*/

function getState() {
    return {
            errors: DSLStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            id: DSLStore.getId(),
            name: DSLStore.getName(),
            source: DSLStore.getSource()
    };
}

var ManageDSLSource = React.createClass({
    
    getInitialState: function() {
        return {
                errors: [],
                isLogged: SessionStore.isLogged(),
                definitionId: this.props.definitionId,
                definitionName: DSLStore.getName(),
                definitionSource: DSLStore.getSource(),
                saved: this.props.definitionId ? true : false
        };
    },

    componentDidMount: function() {
        DSLStore.addChangeListener(this._onChange);
        var id = this.props.definitionId;
        if(id)
            RequestDSLActionCreator.loadDSL(id);
        if(this.state.definitionName)
        {
            this.refs.definitionName.value = this.state.definitionName;
        }
        var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
        var editorSession = editor.getSession();
        editorSession.on("change", this.onEdit);
    },
    
    
    onEdit: function(e) {
        this.setState({ saved: false });
        if(this.refs.save.classList.contains("saved")) {
        	this.refs.save.classList.remove("saved");
    	}
    },
    
    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
        if(!(this.state.errors.length > 0)) 
        {
            this.setState({ saved: true });
            this.refs.save.classList.toggle("saved");
        }
    },
    
    saveSource: function() {
        var editor = ace.edit("editor");
        var source = editor.getValue();
        var definitionName = this.refs.definitionName.value;
        var definitionType = this.refs.definitionType.options[this.refs.definitionType.selectedIndex].value;
        var errors = [];
        if (!definitionType)
        {
            errors.push('Select the definition type before saving');
        }
        if (!definitionName)
        {
            errors.push('Fill the definiton name before saving');  
        }
        else
        {
            if(definitionName == this.state.definitionName)
            {
                alert("overWrite");
                //RequestDSLActionCreator.overwriteDSLDefinition(this.props.definitionId, source);
            }
            else 
            {
                RequestDSLActionCreator.saveDSLDefinition(definitionType, definitionName, source);
            }
        }
        if(errors.length > 0)
        {
            this.setState({ errors: errors });
        }
    },
    
    toggleErrorPopUp: function() {
		this.refs.error.classList.toggle("dropdown-show");
	},
    
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        
        var content, errors;
        if(this.state.errors.length > 0) 
        {
            errors = ( <p id="errors">{this.state.errors.map((error) => <p className="error-item">{error}</p>)}</p> );
            this.toggleErrorPopUp();
        }
        content = (
            <div id="editor-container">
                
                <div className="tooltip" id="editor-back-button">
                        <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                    <p className="tooltip-text">Back</p>
                </div>
                <div id="editor-controls">
                    <form id="definiton-name">
                        <label htmlFor="definitionName">Definition name</label>
                        <input id="definitionName" type="text" ref="definitionName" placeholder="Name">{this.state.definitionName}</input>
                    </form>
                    <div id="editor-buttons">
                        <div className="tooltip">
                            <i id="save-button" onClick={this.saveSource} accesskey="s" className="material-icons md-36 dropdown-button" ref="save">&#xE161;</i>
                            <p className="tooltip-text">Save</p>
                        </div>
                        <div className="tooltip">
                            <i onClick="" className="material-icons md-36 dropdown-button" ref="build">&#xE869;</i>
                            <p className="tooltip-text">Build</p>
                        </div>
                        <div className="tooltip">
                            <i onClick="" className="material-icons md-36 dropdown-button" ref="run">&#xE037;</i>
                            <p className="tooltip-text">Build & Run</p>
                        </div>
                    </div>
                    <form id="definition-type">
                        <label htmlFor="definitionType">Type</label>
                        <select className="select" onChange={this._onSelectChange} id="definitionType" ref="definitionType" >
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
                        <button className="button">Ok</button>
                    </div>
                </div>
            </div>
        );
        
        return (
            <div id="dsl-definiton">
                {content}
            </div>
        );
    }
});

module.exports = ManageDSLSource;