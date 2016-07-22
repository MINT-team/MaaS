// Name: {}
// Module: {}
// Location: {}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;

var Sidebar = React.createClass({

    render: function() {
        return (
            <div id="sidebar">
				<p to="/" id="sidebar-title"><Link to={this.props.titleLink}>{this.props.title}</Link></p>
			    {this.props.data.map((x) =>
			    	<div className="sidebar-field">
    					<Link to={x.link}>{x.icon}{x.label}</Link>
    				</div>
			    )}
		    </div>
	    );

	    /* PROVA STATICA: */
	    /*return (
            <div id="sidebar">
			    <p to="/" id="sidebar-title">Impostazioni Profilo</p>
			    <div className="sidebar-field">
    				<Link to="/profile/changeAvatar"><i className="material-icons md-24">&#xE43B;</i>Avatar</Link>
    			</div>
			    <div className="sidebar-field">
    				<Link to="/profile/personalData"><i className="material-icons md-24">&#xE853;</i>Dati anagrafici</Link>
    			</div>
    			<div className="sidebar-field">
    				<Link to="/profile/changePassword"><i className="material-icons md-24">&#xE897;</i>Password</Link>
    			</div>
		    </div>
	    );*/
    }
});



module.exports = Sidebar;