var React = require('react');
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var RequestExternalDatabaseActionCreator = require('../../actions/Request/RequestExternalDatabaseActionCreator.react.jsx');

var AddExternalDatabase = React.createClass({
    
    getInitialState: function() {
        return {
            errors: [],
            companyId: CompanyStore.getId()
            
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
        if(this.state.errors.length > 0)
            this.refs.errorDropdown.classList.toggle("dropdown-show");
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
        event.preventDefault();
        RequestExternalDatabaseActionCreator.addExtDb(this.state.companyId, this.refs.name.value, this.refs.string.value);
    },
    
    emptyErrors: function() {
	    this.setState({ errors: [] });
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
                    <div className="dropdown-description">{errors}</div>
                    <div className="dropdown-buttons">
                        <button onClick={this.emptyErrors} className="button">Ok</button>
                    </div>
                </div>
                <div className="dropdown-content dropdown-popup" ref="addDropdown">
                    <p className="dropdown-title">Add new database</p>
                    <form className="externaldb-form">
                        <input ref="name" id="name" name="name" placeholder="name" className="dropdown-button" type="text"/>
                        <input ref="string" id="string" name="string" placeholder="connection string" className="dropdown-button full"  type="text"/>
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