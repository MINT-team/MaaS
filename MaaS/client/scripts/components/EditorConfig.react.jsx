/*
* Name: {Error404.react.jsx}
* Module: {Front-end::Views}
* Location: {/MaaS/client/script/components/}
* 
* History:
* Version         Date            Programmer
* ==========================================
* 1.0.0         30/07/2016          Navid Taha
* ------------------------------------------
* Approved stability.
* ==========================================
* 0.1.0        30/07/2016          Fabiano Tavallini
* ------------------------------------------
* Verify of the component.
* ==========================================
* 0.0.4        29/07/2016          Navid Taha
* ------------------------------------------
* Defined connection with UserStore.
* ==========================================
* 0.0.3        28/07/2016          Thomas Fuser
* ------------------------------------------
* Defined connection with RequestUserActionCreator.
* ==========================================
* 0.0.2        28/07/2016          Navid Taha
* ------------------------------------------
* Defined HTML structure of the component.
* ==========================================
* 0.0.1        27/07/2016          Navid Taha
* ------------------------------------------
* First structure of the file.
*/
var React = require('react');
var UserStore = require('../stores/UserStore.react.jsx');
var SessionStore = require('../stores/SessionStore.react.jsx');
var RequestUserActionCreator = require('../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
    return {
        theme: UserStore.getEditorTheme(),
        softTabs: UserStore.getEditorSoftTabs(),
        errors: UserStore.getErrors()
    };
}

var EditorConfig = React.createClass({
    getInitialState: function() {
        return getState();
    },
    
    componentDidMount: function() {
        UserStore.addChangeListener(this._onChange);
    },
    
    componentWillUnmount: function() {
        UserStore.removeChangeListener(this._onChange);
    },
    
    _onChange: function() {
        this.setState(getState());
    },
    
    _onSubmit: function(event) {
      event.preventDefault();
      var softTabs = this.refs.softTabs.checked;
      var theme = this.refs.theme.options[this.refs.theme.selectedIndex].value;
      if (softTabs != this.state.softTabs || theme != this.state.theme)
      {
          RequestUserActionCreator.changeEditorConfig(SessionStore.getUserId(),softTabs,theme);
      }
      else
      {
          window.alert('aa');
          this.setState({
              errors: "No changes to save"
          });
      }
    },
    
    render: function() {
        return (
            <div className="container">
                <p className="container-title">Editor configuration</p>
                <form onSubmit={this._onSubmit} className="form-container">
                    <div className="form-field">
                        <label htmlFor="tabSize">Tab size</label>
                    </div>
                    <div className="form-field">
                        <label htmlFor="softTabs">Soft tabs</label>
                        <div className="form-right-block">
                            <input type="checkbox" id="softTabs" className="cbx hidden" ref="softTabs"/>
                            <label htmlFor="softTabs" className="lbl"></label>
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="fontFamily">Font family</label>
                    </div>
                    <div className="form-field">
                        <label htmlFor="fontSize">Font size</label>
                    </div>
                    <div className="form-field">
                        <label htmlFor="theme">Theme</label>
                        <div className="form-right-block">
                            <select className="select" ref="theme">
                                <option value="chaos">Chaos</option>
                                <option value="dawn">Dawn</option>
                                <option value="twilight">Twilight</option>
                                <option value="ambiance">Ambiance</option>
                                <option value="cobalt">Cobalt</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="tomorrow_night">Tomorrow night</option>
                                <option value="tomorrow_night_blue">Tomorrow night blue</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="form-submit">Save changes</button>
                </form>
            </div>
        );
    }
});

module.exports = EditorConfig;
