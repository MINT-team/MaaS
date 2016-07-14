var React = require('react');

var Editor = React.createClass({
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

<div>
           <div id="editor"></div>

           <script src="ace-builds/src-noconflict/ace.js" type="text/javascript" charset="utf-8"></script>
            <script>
                var editor = ace.edit("editor");
                editor.setTheme("ace/theme/monokai");

                editor.session.setMode("ace/mode/html");
            </script>

</div>
        );
        // TUTTA QUESTA ROBA CHE AVETE MESSO COME SCRIPT NON SI PUO' GIA' METTERE VIA JAVASCRIPT(react)? ;)
    }
});

module.exports = Editor;