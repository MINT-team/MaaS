var React = require('react');
var reactmdl = require('react-mdl');
var FABButton = require('react-mdl/lib').FABButton;
var Icon = require('react-mdl/lib').Icon;

/*
Font size
Font family
Theme
*/
var EditorConfig = React.createClass({
    render: function() {
        return (
            <div className="container">
                <p className="container-title">Editor configuration</p>
                <form onSubmit={this._onSubmit} className="form-container">
                    <div className="form-field">
                        <label htmlFor="nome">Name</label>
                        <input type="text" id="nome" ref="nome" />
                    </div>
                </form>
            </div>
            );
    }
});

module.exports = EditorConfig;
