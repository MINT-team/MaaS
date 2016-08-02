// Name: {ManageDSLSource.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var ace = require('brace');
var Editor = require('../Editor.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DashboardStore = require('../../stores/DashboardStore.react.jsx');

/*
Visualizzare in sola lettura il codice del DSL
Modificare il codice del DSL
Creare un nuovo DSL
Fare una copia di un DSL
*/


function getState() {
    return {
            errors: DashboardStore.getErrors(),
            isLogged: SessionStore.isLogged(),
            definitionName: null,
            definitionId: null
    };
}

var ManageDSLSource = React.createClass({
   
    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        if(this.props.mode == "edit")
        {
            this.setState({ isNew: false });
        }
    },

    componentWillUnmount: function() {
        
    },

    _onChange: function() {
        this.setState(getState());
    },
    
    saveSource: function() {
        var editor = ace.edit("editor");
        var source = editor.getValue();
        var definitionName = this.refs.definitionName.value;
        if (!definitionName)
        {
            
        }
        else if(definitionName == this.state.definitionName)
        {
            
        }
        else
        {
            
        }
        
    },
    
    render: function() {
        if(!this.state.isLogged || this.state.errors.length > 0) {
            return (
                <AuthorizationRequired />
            );
        }
        var title, content;
        title = "";
        
        content = (
            <div id="editor-container">
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