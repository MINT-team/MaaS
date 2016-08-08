// Name: {AddExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// 1.0.0        27/07/2016      Fabiano Tavallini
// ==========================================

var React = require('react');
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var RequestExternalDatabaseActionCreator = require('../../actions/Request/RequestExternalDatabaseActionCreator.react.jsx');

var AddExternalDatabase = React.createClass({
    
    getInitialState: function() {
        return {
            errors: []
        };
    },
    
    componentDidMount: function() {
        ExternalDatabaseStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        ExternalDatabaseStore.removeChangeListener(this._onChange);
    },
    
    _onChange: function() {
        this.setState({errors: ExternalDatabaseStore.getErrors() });
    },
    
    toggleDropdown: function(event) {
		event.preventDefault();
		if(this.state.errors.length > 0)
		{
		    this.refs.errorDropdown.classList.toggle("dropdown-show");
		}
		else
		{
		    this.refs.addDropdown.classList.toggle("dropdown-show");
		}
	},
	
	confirmAdd: function(event) {
	    /*
        event.preventDefault();
        var id = this.state.id;
        if(id != "")
        {
            RequestDSLActionCreator.deleteDSLDefinition(id);
        }
        else
        {
            this.setState({ errors: "Error retrieving DSL id" });
        }
        */
    },
    
    render: function() {
        var errors;
        if(this.state.errors.length > 0) {
            errors = (
              <p id="errors">{this.state.errors}</p>
            );
        }
        return (
            <div id="add-externalDatabase" className="pop-up">
                <i onClick={this.toggleDropdown} className="material-icons md-48 dropdown-button">&#xE147;</i>
                <div className="dropdown-content dropdown-popup" ref="errorDropdown">
                    <p className="dropdown-title">Error</p>
                    <p className="dropdown-description">{errors}</p>
                    <div className="dropdown-buttons">
                        <button className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="addDropdown">
                    <p className="dropdown-title">Add new database</p>
                    <form className="externaldb-form">
                        <input id="name" name="name" placeholder="Database name" className="dropdown-button" type="text" autocomplete="off"/>
                        <input id="password" name="password" placeholder="Database password" className="dropdown-button" type="password" autocomplete="off"/>    
                        <input id="string" name="string" placeholder="Connection string" className="dropdown-button full"  type="text" autocomplete="off"/>
                    </form>
                    <div className="dropdown-buttons">
                        <button className="inline-button">Cancel</button>
                        <button id="confirm-button" className="inline-button" onClick={this.confirmAdd}>Add</button>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = AddExternalDatabase;