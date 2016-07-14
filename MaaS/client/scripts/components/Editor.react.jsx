var React = require('react');

var Editor = React.createClass({
    componentDidMount: function() {
        var script = document.createElement("script");
        script.src = "ace-builds/src-noconflict/ace.js";
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = true;
        document.body.appendChild(script);
        var script = document.createElement("script");
        script.src = "editor-config.js";
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = true;
        document.body.appendChild(script);
    },

    render() {
        return (
        /*<div>
        <div id="editor"></div>
            <script src="./ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
            <script>
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/html");
            </script>
        </div> */
        <div id="editor"></div>

        );
    }
});

/*
<div>
           <div id="editor"></div>

           <script src="ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
            <script>
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/monokai");
                editor.session.setMode("ace/mode/html");
            </script>

</div>
*/

module.exports = Editor;