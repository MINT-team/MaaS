// Name: {Sidebar.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;

var Sidebar = React.createClass({

    render: function() {
        return (
            <div id="sidebar">
            	{this.props.titleLink ?
            		<p to="/" id="sidebar-title"><Link to={this.props.titleLink}>{this.props.title}</Link></p>
            		: <p to="/" id="sidebar-title"><span>{this.props.title}</span></p>
            	}
			    {this.props.data.map((x) =>
			    	<div key={x.label} className="sidebar-field">
			    		{x.link ?
    						<Link to={x.link}>{x.icon}{x.label}</Link>
    						: <a onClick={x.onClick}>{x.icon}{x.label}</a>
			    		}
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