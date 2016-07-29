// Name: {ExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var SessionStore = require('../../stores/SessionStore.react.jsx');
//var CompanyStore = require('../../stores/CompanyStore.react.jsx');
var ExternalDatabaseStore = require('../../stores/ExternalDatabaseStore.react.jsx');
var RequestActionCreator = require('../../actions/Request/RequestExternalDatabasesActionCreator.react.jsx');

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
var ReactMotion = require('react-motion');
var Collapse = require('react-collapse');
var ReactHeight = require('react-height');

function getState() {
  RequestActionCreator.getDbs();
  return {
          //errors: CompanyStore.getErrors(),
          errors: ExternalDatabaseStore.getErrors(),
          isOpened: false,
          isLogged: SessionStore.isLogged()
      };
}


var ExternalDatabases = React.createClass({
  
    getInitialState: function() {
      return getState();
  },
  
  openForm: function(){
   this.setState({isOpened: !this.state.isOpened}
   
   );
 },
  
  componentDidMount: function() {
      SessionStore.addChangeListener(this._onChange);
      ExternalDatabaseStore.addChangeListener(this._onChange());
  },

  componentWillUnmount: function() {
      SessionStore.removeChangeListener(this._onChange);
      ExternalDatabaseStore.removeChangeListener(this._onChange());
  },

  _onChange: function() {
      this.setState(getState());
  },
  

  render: function() {
    var isOpened = this.state.isOpened;
    if(!this.state.isLogged || this.state.errors.length > 0 || !this.props.users) {
        return (
            <div className="container">
              <p className="container-title">Authorization required</p>
              <p className="container-description">You are not authorized to view this page
              <img src="../images/jurassic.gif" alt=""/>
              </p>
              <Link to="/" className="button">Back to home</Link>
            </div>
        );
    }
    
  
  var selectRowProp = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "rgba(144, 238, 144, 0.42)",
};
  
 var products = [
  {
      id: 1,
      name: "Product1",
      price: 120
  },{
      id: 2,
      name: "Product2",
      price: 80
  },{
      id: 3,
      name: "Product3",
      price: 207
  },{
      id: 4,
      name: "Product4",
      price: 100
  },{
      id: 5,
      name: "Product5",
      price: 150
  },{
      id: 6,
      name: "Product1",
      price: 160
  },{
      id: 7,
      name: "Product1",
      price: 120
  },{
      id: 8,
      name: "Product2",
      price: 80
  },{
      id: 9,
      name: "Product3",
      price: 207
  },{
      id: 10,
      name: "Product4",
      price: 100
  },{
      id: 11,
      name: "Product5",
      price: 150
  },{
      id: 12,
      name: "Product1",
      price: 160
  },{
      id: 13,
      name: "Product1",
      price: 120
  },{
      id: 14,
      name: "Product2",
      price: 80
  },{
      id: 15,
      name: "Product3",
      price: 207
  },{
      id: 16,
      name: "Product4",
      price: 100
  },{
      id: 18,
      name: "Product5",
      price: 150
  },{
      id: 19,
      name: "Product1",
      price: 160
  },{
      id: 20,
      name: "Product1",
      price: 120
  },{
      id: 21,
      name: "Product2",
      price: 80
  },{
      id: 22,
      name: "Product3",
      price: 207
  },{
      id: 23,
      name: "Product4",
      price: 100
  },{
      id: 24,
      name: "Product5",
      price: 150
  },{
      id: 25,
      name: "Product1",
      price: 160
  }
];

  
var data = [];

    RequestActionCreator.getDbs();
    var databases = ExternalDatabaseStore.getDbNames();

    
    var title, content;
  
    title = "Manage Database";
    content = (
          <div id="content">
            <div id="successful-operation">
                <p>Manage your external database, add new or disable existing ones.</p>
            </div>
          
            <div id="add-database">
            <button onClick={() => this.setState({isOpened: !isOpened}) } className="inline-button">Add Database</button>
              <Collapse isOpened={this.state.isOpened} >
                <form action="" method="post" className="externaldb">
                <fieldset>
                  <input id="name" name="name" placeholder="Database name" type="text" />
                  <input id="password" name="password" placeholder="Database password" type="password" />    
                  <input id="string" name="string" placeholder="Connection string" type="text" />
                  <button className="inline-button">Add</button>
                </fieldset>
              </form>

            </Collapse>  
              
            </div>
            <div id="table-database">
              <BootstrapTable selectRow={selectRowProp} pagination={true} data={products} search={true} striped={true} hover={true}>
                <TableHeaderColumn isKey={true} dataField="id">Product ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name">Product Name</TableHeaderColumn>
                <TableHeaderColumn dataField="price">Product Price</TableHeaderColumn>
              </BootstrapTable>
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