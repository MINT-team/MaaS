var React = require('react');
var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/chaos');

var Editor = React.createClass({
    componentDidMount: function() {
        var script = document.createElement("script");
        script.src = "editor-config.js";
        script.type = "text/javascript";
        script.charset = "utf-8";
        document.body.appendChild(script);
    },

    render: function() {
        return (
            <div id="editor"></div>
        );
    }
});

module.exports = Editor;