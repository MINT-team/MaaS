// Name: {Editor.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================


var React = require('react');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');

function getState() {
    return {
        theme: UserStore.getEditorTheme(),
        softTabs: UserStore.getEditorSoftTabs(),
        tabSize: UserStore.getEditorTabSize(),
        fontSize: UserStore.getEditorFontSize()
    };
}

var Editor = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
        editor.setTheme("ace/theme/"+ this.state.theme);
        editor.session.setUseSoftTabs(this.state.softTabs == "true");
        editor.setFontSize(parseInt(this.state.fontSize,10));
        editor.session.setTabSize(parseInt(this.state.tabSize,10));
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState(getState());
    },

    render: function() {
        return (
            <div id="editor"></div>
        );
    }
});

module.exports = Editor;