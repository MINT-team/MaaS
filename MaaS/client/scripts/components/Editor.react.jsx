var React = require('react');
var UserActionCreator = require('../actions/UserActionCreator.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');

var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/chaos');

var Editor = React.createClass({

    // -*-* usate questo!!  -*-*
    // getInitialState: function () {
    //     //return UserStore.getEditorConfig();
    // },

    componentDidMount: function() {
        var script = document.createElement("script");
        script.src = "editor-config.js";
        script.type = "text/javascript";
        script.charset = "utf-8";
        document.body.appendChild(script);
        UserActionCreator.getEditorConfig(SessionStore.getUserId());
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