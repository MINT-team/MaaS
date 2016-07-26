// Name: {ExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var CompanyStore = require('../../stores/CompanyStore.react.jsx');

function getState() {
  return {
          errors: CompanyStore.getErrors(),
          isLogged: SessionStore.isLogged()
      };
}


var ExternalDatabases = React.createClass({
  
    getInitialState: function() {
      return getState();
  },
  
  componentDidMount: function() {
      SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },
 
  render: function() {
    
    if(!this.state.isLogged || this.state.errors.length > 0 || !this.props.users) {
        return (
            <div className="container">
              <p className="container-title">Authorization required</p>
              <p className="container-description">You are not authorized to view this page</p>
              <Link to="/" className="button">Back to home</Link>
            </div>
        );
    }

    var title, content;
    
    title = "Manage Database";
    content = (
          <div id="content">
            <div id="successful-operation">
                <p>Manage your external database, add new or disable existing ones.</p>
            </div>
            <div id="add-database" className="table-row">
            
              <form action="" method="post" className="form-vertical-block">
                <label>Name:</label>
                  <input id="name" name="name" type="text"/>
                <label>Host:</label>
                  <input id="host" name="host" type="text"/>
                <label>Port:</label>
                  <input id="port" name="port" type="text"/>
                <label>Password:</label>
                  <input id="password" name="password" type="text"/>  
                <button className="inline-button">Add</button>
              </form>
            
            </div>
            <div id="table-database">
                
            </div>
          </div>
        );
        
    return (
      <div className="container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
  }
});


module.exports = ExternalDatabases;

