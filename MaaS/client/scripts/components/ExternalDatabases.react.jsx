var React = require('react');
var Table = require('material-ui/Table').Table;
var TableBody = require('material-ui/Table').TableBody;
var TableHeader = require('material-ui/Table').TableHeader
var TableHeaderColumn = require('material-ui/Table').TableHeaderColumn;
var TableRow = require('material-ui/Table').TableRow;
var TableRowColumn = require('material-ui/Table').TableRowColumn;

var ExternalDatabases = React.createClass({
	render: function() {
	    return (
	    <Table>
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Database</TableHeaderColumn>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Status</TableHeaderColumn>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableRowColumn>Prova</TableRowColumn>
                    <TableRowColumn>Prova</TableRowColumn>
                    <TableRowColumn>Prova</TableRowColumn>
                </TableRow>
            </TableBody>
        </Table>
    );
	}
});

module.exports = ExternalDatabases;
