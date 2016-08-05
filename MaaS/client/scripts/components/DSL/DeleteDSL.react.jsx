// Name: {Delete.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// 1.0.0        27/07/2016      Fabiano Tavallini
// ==========================================

var React = require('react');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');

var DeleteDSL = React.createClass({

    getInitialState: function() {
        return {
            id: this.props.id,
            name: this.props.name,
            errors: []
        };
    },

    componentDidMount: function() {
        DSLStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        DSLStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({errors: DSLStore.getErrors() });
    },
    
    toggleDropdown: function(event) {
		event.preventDefault();
		if(this.state.errors.length > 0) {
		    this.refs.errorDropdown.classList.toggle("dropdown-show");
		} else {
		    this.refs.deleteDropdown.classList.toggle("dropdown-show");
		}
	},

    confirmDelete: function(event) {
        event.preventDefault();
        var id = this.state.id;
        if(id != "") {
            RequestDSLActionCreator.deleteDSLDefinition(id);
        } else {
            this.setState({ errors: "Error retrieving DSL id" });
        }
    },

    render: function() {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="delete-user">
                <i onClick={this.toggleDropdown} className="material-icons md-24 dropdown-button">&#xE5C9;</i>
                <div className="dropdown-content dropdown-popup" ref="errorDropdown">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="deleteDropdown">
                    <p className="dropdown-title">Delete DSL definition</p>
                    <p className="dropdown-description">Are you sure you want to delete <span id="successful-email">{this.state.name}</span> DSL definition?</p>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="delete-button" className="inline-button" onClick={this.confirmDelete}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = DeleteDSL;