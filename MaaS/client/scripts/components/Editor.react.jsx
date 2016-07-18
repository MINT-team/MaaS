
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

var Editor = React.createClass({

    getState: function() {
        return UserStore.getEditorConfig();
    },

    /*getInitialState: function() {
        return UserStore.getEditorConfig();
    },
*/
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);

        /*var script = document.createElement("script");
        script.src = "editor-config.js";
        script.type = "text/javascript";
        script.charset = "utf-8";
        document.body.appendChild(script);*/
        //RequestUserActionCreator.getEditorConfig(SessionStore.getUserId());

        /*var theme = this.getState().theme;
        window.alert(theme);
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/".theme);
        editor.session.setMode("ace/mode/javascript");*/
    },

    componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        /*var theme = this.getState().theme;
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/".theme);
        editor.session.setMode("ace/mode/javascript");*/
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