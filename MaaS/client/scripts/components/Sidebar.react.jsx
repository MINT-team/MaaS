var React = require('react');
var Link = require('react-router').Link;

var Sidebar = React.createClass({
	getInitialState: function(){
		return {
			links: null
		};
	},

    render: function() {
        /*var links = this.state.links;
    	var title;
    	var menu;
		var icon;
		var link;
    	if (links.length != 0) {
    		title = (
    			<p to="/" id="sidebar-title">Impostazioni Profilo</p>
    		);
    		for(var i=0; i<links.length; i++) {
    			icon = this.state.....
    			link = this.state.....
    			if(!icon) {
    				icon = &#xE892;
    			}
                menu[i] = (
                    <div className="sidebar-field">
    					<Link to="{link}"><i className="material-icons md-24">{icon}</i></Link>
    				</div>
                );
    		}
    	}
        return (
            <div id="sidebar">
			    {title}
			     {menu}
		    </div>
	    );*/


	    /* PROVA STATICA: */
	    return (
            <div id="sidebar">
			    <p to="/" id="sidebar-title">Impostazioni Profilo</p>
			    <div className="sidebar-field">
    				<Link to=""><i className="material-icons md-24">&#xE892;</i>link1</Link>
    			</div>
    			<div className="sidebar-field">
    				<Link to=""><i className="material-icons md-24">&#xE892;</i>link2</Link>
    			</div>
    			<div className="sidebar-field">
    				<Link to=""><i className="material-icons md-24">&#xE892;</i>link3</Link>
    			</div>
		    </div>
	    );
    }
});



module.exports = Sidebar;