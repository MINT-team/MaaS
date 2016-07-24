// Name: {ExternalDatabase.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================


var React = require('react');
var mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  Dialog = mui.Dialog,
  FlatButton = mui.FlatButton,
  Table = mui.Table,
  TableBody = mui.TableBody,
  TableHeader = mui.TableHeader,
  TableHeaderColumn = mui.TableHeaderColumn,
  TableRow = mui.TableRow,
  TableRowColumn = mui.TableRowColumn;
var MuiThemeProvider = require('material-ui').MuiThemeProvider;


var ExternalDatabases = React.createClass({

  getInitialState: function() {
    return { open: false };
  },

  handleOpen: function() {
    this.setState({open: true});
  },

  handleClose: function(){
    this.setState({open: false});
  },

 render: function() {

  const style = {
    margin: 12,
  };

  const actions = (
   <div>
      <FlatButton
        label="Cancel"
        onClick={this.handleClose}
      />
      <FlatButton
        label="Confirm"
        keyboardFocused={true}
        onClick={this.handleClose}
      />
   </div>
    );


  return (
    <div>
      <RaisedButton label="Add ExternalDatabase" fullWidth={true} style={style} onClick={this.handleOpen}  />
      <Dialog
          title="Add ExternalDatabase"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}>
          Qua vanno inseriti i parametri per aggiungere il database.
        </Dialog>
      <Table>
    <TableHeader>
      <TableRow>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Name</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableRowColumn>1</TableRowColumn>
        <TableRowColumn>John Smith</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>2</TableRowColumn>
        <TableRowColumn>Randal White</TableRowColumn>
        <TableRowColumn>Unemployed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>3</TableRowColumn>
        <TableRowColumn>Stephanie Sanders</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
      <TableRow>
        <TableRowColumn>4</TableRowColumn>
        <TableRowColumn>Steve Brown</TableRowColumn>
        <TableRowColumn>Employed</TableRowColumn>
      </TableRow>
    </TableBody>
  </Table>
    </div>
	    );
    }
});

module.exports = ExternalDatabases;
