// Name: {Editor.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

// History:
// Version         Date            Programmer
// ==========================================



var React = require('react');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/chaos');
require('brace/theme/dawn');
require('brace/theme/twilight');

function getState() {
    //window.alert("get state: "+UserStore.getEditorTheme());
    return {
        /*config: {
            theme:  UserStore.getEditorConfig()
        }*/
        theme: UserStore.getEditorTheme()
    };
}

var Editor = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        window.alert(this.state.theme);
        //window.alert(this.state.theme);
         /*var editor = ace.edit("editor");
         editor.setTheme("ace/theme/"+ this.state.theme);*/
    },

    componentWillUnmount: function() {
        // window.alert("unmount del componente");
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        //window.alert("On change");
        this.setState(getState());
    },

    render: function() {

        return (
            <div id="editorContainer">
                <div id="editor"></div>
            </div>
        );
    }
});

module.exports = Editor;