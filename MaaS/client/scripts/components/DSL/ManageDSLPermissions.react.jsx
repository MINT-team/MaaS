// Name: {ManageDSLPermission.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Company/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;

var ReactBSTable = require('react-bootstrap-table');  
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;

var AuthorizationRequired = require('../AuthorizationRequired.react.jsx');
var SessionStore = require('../../stores/SessionStore.react.jsx');
var DSLStore = require('../../stores/DSLStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestDSLActionCreator = require('../../actions/Request/RequestDSLActionCreator.react.jsx');

var ManageDSLPermissions = React.createClass({
    render: function() {
        if(!this.state.isLogged) 
        {
            return (
                <AuthorizationRequired />
            );
        }
        var content, errors = [];
        return (
            <div id="dsl-definition-permissions">
                {content}
            </div>
            
        );
    }
    
});

module.exports = ManageDSLPermissions;

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
dsl1    Utente1  esecuzione
dsl1    Utente2  scrittura
dsl1    Utente3  lettura
dsl2    Utente3  esecuzione
*/

/*
Guest: esecuzione
Member: Permesso di scrittura (sui propri)
Owner/Admin:  Permesso di scrittura (su tutti)
*/

/*
Permesso = 'esecuzione', 'scrittura', 'lettura'
1) Permesso di scrittura: modifica + cancellazione + lettura + esecuzione
2) Permesso di lettura: lettura + esecuzione
3) Permesso di esecuzione: esecuzione
*/