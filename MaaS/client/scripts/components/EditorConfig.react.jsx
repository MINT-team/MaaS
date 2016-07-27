// Name: {Error404.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');

var EditorConfig = React.createClass({
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
                            <input type="checkbox" id="softTabs" className="cbx hidden"/>
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
                    </div>
                </form>
            </div>
            );
    }
});

module.exports = EditorConfig;
