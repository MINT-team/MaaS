//var UserStore = require('../../scripts/stores/UserStore.react.jsx');

var UserStore = require('./app.js').UserStore;
var editorConfig = UserStore.getEditorConfig;
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chaos");
editor.session.setMode("ace/mode/javascript");