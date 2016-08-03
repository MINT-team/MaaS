// Name: {ManageDSLSource.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var ace = require('../../brace');
var Editor = require('../Editor.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DashboardStore = require('../../stores/DashboardStore.react.jsx');
var CollectionStore = require('../../stores/CollectionStore.react.jsx');
var DocumentStore = require('../../stores/DocumentStore.react.jsx');
var CellStore = require('../../stores/CellStore.react.jsx');
var RequestDashboardActionCreator = require('../../actions/Request/RequestDashboardActionCreator.react.jsx');
var RequestCollectionActionCreator = require('../../actions/Request/RequestCollectionActionCreator.react.jsx');
var RequestDocumentActionCreator = require('../../actions/Request/RequestDocumentActionCreator.react.jsx');
var RequestCellActionCreator = require('../../actions/Request/RequestCellActionCreator.react.jsx');
var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');


/*
Visualizzare in sola lettura il codice del DSL
Modificare il codice del DSL
Creare un nuovo DSL
Fare una copia di un DSL
*/


function getState() {
    return {
            errors: [], //DashboardStore.getErrors(),
            isLogged: SessionStore.isLogged()
    };
}

var ManageDSLSource = React.createClass({
   
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        if(this.props.definitionName) 
        {
            this.refs.definitionName.value = this.props.definitionName;
        }
    },

    componentWillUnmount: function() {
        
    },

    _onChange: function() {
        this.setState(getState());
        if(!(this.state.errors.length > 0)) 
        {
            this.toggleSavePopUp();
        }
    },

    saveSource: function() {
        var editor = ace.edit("editor");
        var source = editor.getValue();
        var definitionName = this.refs.definitionName.value;
        if (!definitionName)
        {
            var error = 'Fill the definiton name before saving';
            this.setState({ errors: error });
        }
        else 
        {
            if(definitionName == this.props.definitionName)
                RequestCellActionCreator.saveCellDefinition(definitionName, source);
            else
                RequestCellActionCreator.overwriteCellDefinition(this.props.definitionId, source);
        }
    },
    
    toggleErrorPopUp: function() {
		this.refs.error.classList.toggle("dropdown-show");
	},
	
	toggleSavePopUp: function() {
	    this.refs.save.classList.toggle("dropdown-show");
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
            errors = ( <span id="errors">{this.state.errors}</span> );
            this.toggleErrorPopUp();
        }
        content = (
            <div id="editor-container">
                <div id="editor-controls">
                    <form id="definiton-name">
                        <label htmlFor="definitionName">Definition name</label>
                        <input id="definitionName" type="text" ref="definitionName" placeholder="Name" />
                    </form>
                    <div className="dropdown-content dropdown-popup" ref="error">
                        <p className="dropdown-title">Error</p>
                        <p className="dropdown-description">{errors}</p>
                        <div className="dropdown-buttons">
                            <button className="button">Ok</button>
                        </div>
                    </div>
                    <div id="editor-buttons">
                        <i onClick={this.saveSource} className="material-icons md-36 dropdown-button">&#xE161;</i>
                        <i onClick="" className="material-icons md-36 dropdown-button">&#xE869;</i>
                        <i onClick="" className="material-icons md-36 dropdown-button">&#xE037;</i>
                    </div>
                </div>
                <div id="editor-viewer">
                    <Editor />
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