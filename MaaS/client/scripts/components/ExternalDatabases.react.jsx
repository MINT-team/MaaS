var React = require('react');
var mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  Dialog = mui.Dialog;

var ExternalDatabases = React.createClass({

 render: function() {

  const style = {
  margin: 12,
  };

  return (
    <div>
      <RaisedButton label="Aggiungi DataBase" style={style} onTouchTap={this.handleOpen} />
      <Dialog
          title="Dialog With Actions"
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.
        </Dialog>
    </div>
     );
    }
});

module.exports = ExternalDatabases;
