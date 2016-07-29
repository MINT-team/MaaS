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

var ace = require('brace');
require('brace/theme/chaos');
require('brace/theme/dawn');
require('brace/theme/twilight');
require('brace/theme/ambiance');
require('brace/theme/cobalt');
require('brace/theme/tomorrow');
require('brace/theme/tomorrow_night');
require('brace/theme/tomorrow_night_blue');

function getState() {
    return {
        theme: UserStore.getEditorTheme(),
        softTabs: UserStore.getEditorSoftTabs()
    };
}

var Editor = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        window.alert(this.state.theme);
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/"+ this.state.theme);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
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