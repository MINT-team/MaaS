var React = require('react');
var reactmdl = require('react-mdl');
var FABButton = require('react-mdl/lib').FABButton;
var Icon = require('react-mdl/lib').Icon;
var Toggle = React.createClass({
    render: function() {
        return (
                <FABButton colored ripple>
                    <Icon name="add" />
                </FABButton>
            );
    }
});

module.exports = Toggle;
