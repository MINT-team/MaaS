var React = require('react');

var Header = React.createClass({
	
	handleClick: function(event) {
	    if(!event.target.className.match("dropdown-button")) {
		    var dropdowns = document.getElementsByClassName("dropdown-content");
		    var i;
		    for (i = 0; i < dropdowns.length; i++) {
				var openDropdown = dropdowns[i];
		    	if (openDropdown.classList.contains("dropdown-show")) {
		        	openDropdown.classList.remove("dropdown-show");
		    	}
			}
		}
		document.getElementsByClassName("dropdown-button");
	},

	componentDidMount: function() {
    	window.addEventListener('click', this.handleClick);
	},

	componentWillUnmount: function() {
    	window.removeEventListener('click', this.handleClick);
	},
	
	toggleDropdown: function(event) {
		event.preventDefault();
		this.refs.dropdownMenu.classList.toggle("dropdown-show");
	},
	
    render: function() {
        return (
            <div id="header">
			    <a id="title" href="" >MaaS</a>
			    <a href="">Dashboard</a>
			    <a href="">link2</a>
			    <a href="">link3</a>
			    <a href="">link4</a>
			    <div id="header-panel">
			    	<a href="" ><i className="material-icons md-36">&#xE7FD;</i></a>
			    	<a href="" id="settings-button" onClick={this.toggleDropdown}>
			    		<i className="material-icons md-36 dropdown-button">&#xE8B8;</i>
			    	</a>
				    <div className="dropdown-content" ref="dropdownMenu">
				    	<ul>
				    		<a href=""><li>Dashboard attiva</li></a>
				    		<a href=""><li>link5</li></a>
				    		<a href=""><li>link6</li></a>
				    		<a href=""><li>link7</li></a>
				    	</ul>
				    </div>
			    </div>
		    </div>
	    );
    }
});

module.exports = Header;