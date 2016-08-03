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

var ace = require('../brace');
require('../brace/theme/chaos');
require('../brace/theme/dawn');
require('../brace/theme/twilight');
require('../brace/theme/ambiance');
require('../brace/theme/cobalt');
require('../brace/theme/tomorrow');
require('../brace/theme/tomorrow_night');
require('../brace/theme/tomorrow_night_blue');

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
        var editor = ace.edit("editor");
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