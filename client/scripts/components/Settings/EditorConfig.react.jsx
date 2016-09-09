var React = require('react');
var Link = require('react-router').Link;
var UserStore = require('../../stores/UserStore.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');
var Editor = require('../Editor.react.jsx');

function getState() {
    return {
        theme: UserStore.getEditorTheme(),
        softTabs: UserStore.getEditorSoftTabs(),
        tabSize: UserStore.getEditorTabSize(),
        fontSize: UserStore.getEditorFontSize(),
        errors: UserStore.getErrors()
    };
}

var EditorConfig = React.createClass({
    getInitialState: function() {
        return {
            submit: false,
            theme: UserStore.getEditorTheme(),
            currentTheme: UserStore.getEditorTheme(),
            softTabs: UserStore.getEditorSoftTabs(),
            tabSize: UserStore.getEditorTabSize(),
            fontSize: UserStore.getEditorFontSize(),
            errors: UserStore.getErrors()
        };
    },
    
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
        this.initForm();
    },
    
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    
    componentDidUpdate: function() {
        this.initForm();
    },
    
    initForm: function() {
        if(!this.state.submit)
        {
            var editor = ace.edit("editor"); // ace variable will be defined when index.html execute ace.js
            editor.$blockScrolling = Infinity;
            var example = "Collection(\n\ttable: \"users\",\n\tlabel: \"Users\",\n\tperpage: 2,\n\tsortby: \"surname\",\n\torder: \"asc\",\n\tquery: {level: {$lt: \"5\"}}\n) {\n\tcolumn(\n\t\tname: \"email\",\n\t\ttype: \"string\",\n\t\tlabel: \"Email\",\n\t\tselectable: true\n\t)\n\taction(\n\t\tExport: \"true\",\n\t\tSendEmail: \"true\"\n\t)\n}";
            editor.setValue(example, -1);
            if (this.state.softTabs == "true")
            {
                document.getElementById('softTabs').checked = true;
            }
            else
            {
                document.getElementById('softTabs').checked = false;
            }
            document.getElementById('theme').value = this.state.currentTheme ? this.state.currentTheme : this.state.theme;
            document.getElementById('tabSize').value = this.state.tabSize;
            document.getElementById('fontSize').value = this.state.fontSize;
        }
    },
    
    _onChange: function() {
        this.setState(getState());
        this.setState({submit: true});
    },
    
    _onSubmit: function(event) {
      event.preventDefault();
      var checked;
      this.refs.softTabs.checked ? checked = "true" : checked = "false";
      var softTabs = checked;
      var theme = this.refs.theme.options[this.refs.theme.selectedIndex].value;
      var tabSize = this.refs.tabSize.value;
      var fontSize = this.refs.fontSize.value;
      if(softTabs != this.state.softTabs || theme != this.state.theme || tabSize != this.state.tabSize || fontSize != this.state.fontSize)
      {
          RequestUserActionCreator.changeEditorConfig(SessionStore.getUserId(), softTabs, theme, tabSize, fontSize);
      }
      else
      {
          this.setState({
              errors: "No changes to save"
          });
      }
    },
    
    backToConfig: function(event) {
        event.preventDefault();
        this.setState({submit: false});
    },
    
    _onSelectChange: function(event) {
        this.setState({currentTheme: event.target.value});
    },
    
    render: function() {
        var title, content, errors;
        if (!this.state.submit || this.state.errors.length > 0)
        {
            title = "Editor configuration";
            if (this.state.errors.length > 0)
            {
                errors = (
                    <p id="errors">{this.state.errors}</p>
                );
            }
            content = (
                <div>
                    <form onSubmit={this._onSubmit} className="form-container">
                        <div className="form-field">
                            <label htmlFor="tabSize">Tab size</label>
                            <div className="form-right-block">
                                <input type="number" id="tabSize" ref="tabSize" min="1" max="64"/>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="softTabs">Soft tabs</label>
                            <div className="form-right-block-checkbox">
                                <input type="checkbox" id="softTabs" className="cbx hidden" ref="softTabs" />
                                <label htmlFor="softTabs" className="lbl"></label>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="fontSize">Font size</label>
                            <div className="form-right-block">
                                <input type="number" id="fontSize" ref="fontSize" min="1" max="72"/>
                            </div>
                        </div>
                        <div className="form-field">
                            <label htmlFor="theme">Theme</label>
                            <div className="form-right-block">
                                <select id="theme" className="select" onChange={this._onSelectChange} ref="theme">
                                    <optgroup label="Bright">
                                        <option value="dawn">Dawn</option>
                                        <option value="iplastic">IPlastic</option>
                                        <option value="tomorrow">Tomorrow</option>
                                        <option value="xcode">XCode</option>
                                        <option value="chrome">Chrome</option>
                                        <option value="textmate">TextMate</option>
                                    </optgroup>
                                    <optgroup label="Dark">
                                        <option value="chaos">Chaos</option>
                                        <option value="merbivore">Merbivore</option>
                                        <option value="ambiance">Ambiance</option>
                                        <option value="vibrant_ink">Vibrant Ink</option>
                                        <option value="cobalt">Cobalt</option>
                                        <option value="twilight">Twilight</option>
                                        <option value="tomorrow_night">Tomorrow night</option>
                                        <option value="tomorrow_night_blue">Tomorrow night blue</option>
                                        <option value="tomorrow_night_bright">Tomorrow night bright</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                        {errors}
                        <button type="submit" className="form-submit">Save changes</button>
                    </form>
                    <div id="editorContainerPreview">
                        <Editor theme={this.state.currentTheme}/>
                    </div>
                </div>
            );
        }
        else
        {
            title = "Editor configuration changed";
            content = (
                <div id="successful-operation">
                    <p>Your editor configuration has been changed successfully.</p>
                    <Link onClick={this.backToConfig} id="successful-button" className="button" to="">Back to your editor configuration</Link>
                </div>
            );
        }
        
        return (
            <div className="container">
                <p className="container-title">{title}</p>
                {content}
            </div>
        );
    }
});

module.exports = EditorConfig;
