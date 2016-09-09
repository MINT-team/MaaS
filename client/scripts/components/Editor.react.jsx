// Name: {Editor.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================


var React = require('react');
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
        var state = getState();
        state.theme = this.props.theme || UserStore.getEditorTheme();
        return state;
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        ace.require("ace/ext/language_tools");
        var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
        editor.setTheme("ace/theme/"+ this.state.theme);
        //editor.getSession().setMode("ace/mode/dsl");
        editor.getSession().setMode("ace/mode/dsl");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        editor.session.setUseSoftTabs(this.state.softTabs == "true");
        editor.setFontSize(parseInt(this.state.fontSize,10));
        editor.session.setTabSize(parseInt(this.state.tabSize,10));
    },
    
    componentDidUpdate: function() {
        var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
        editor.setTheme("ace/theme/"+ (this.props.theme ? this.props.theme : this.state.theme));
        
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