
// Name: {}
// Module: {}
// Location: {}

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
    return {
        /*config: {
            theme:  UserStore.getEditorConfig()
        }*/
        theme: UserStore.getEditorConfig()
    };
}

var Editor = React.createClass({

    getInitialState: function() {
        return getState();
    },

    // componentDidMount: function() {
    //     UserStore.addChangeListener(this._onChange);
    //     window.alert(this.state.theme);
    //     /*var editor = ace.edit("editor");
    //     editor.setTheme("ace/theme/"+ this.state.theme);*/
    // },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        window.alert("MOUNT del componente"+this.state.theme);
    },

    componentWillUnmount: function() {
        window.alert("unmount del componente");
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        window.alert("On change");
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