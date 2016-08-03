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
        var definitionType = this.refs.definitionType.options[this.refs.definitionType.selectedIndex].value;
        if (!definitionName)
        {
            var error = 'Fill the definiton name before saving';
            this.setState({ errors: error });
        }
        else
        {
            if(definitionName == this.props.definitionName)
                RequestDSLActionCreator.overwriteDSLDefinition(this.props.definitionId, source);
            else
                RequestDSLActionCreator.saveDSLDefinition(definitionType, definitionName, source);
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
                <div id="editor-back-button">
                    <Link to="manageDSL"><i className="material-icons md-48">&#xE15E;</i></Link>
                </div>
                <div id="editor-controls">
                    <form id="definiton-name">
                        <label htmlFor="definitionName">Definition name</label>
                        <input id="definitionName" type="text" ref="definitionName" placeholder="Name" />
                    </form>
                    <div id="editor-buttons">
                        <i onClick={this.saveSource} className="material-icons md-36 dropdown-button">&#xE161;</i>
                        <i onClick="" className="material-icons md-36 dropdown-button">&#xE869;</i>
                        <i onClick="" className="material-icons md-36 dropdown-button">&#xE037;</i>
                    </div>
                    <form id="definition-type">
                        <label htmlFor="definitionType">Type</label>
                        <select className="select" onChange={this._onSelectChange} id="definitionType" ref="definitionType" >
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