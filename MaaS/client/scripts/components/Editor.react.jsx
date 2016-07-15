var React = require('react');
/*var ace = require('brace');
require('brace/mode/javascript');
require('brace/theme/monokai');*/
//var editor = ace.edit('editor');
//editor.getSession().setMode('ace/mode/javascript');
//editor.setTheme('ace/theme/monokai');
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