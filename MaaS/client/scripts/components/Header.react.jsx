var React = require('react');

var Header = React.createClass({
  
    render() {
        return (
            <div id="header">
			    <a id="title" href="" >MaaS</a>
			    <a href="">Dashboard</a>
			    <a href="">link2</a>
			    <a href="">link3</a>
			    <a href="">link4</a>
			    <a id="preferences"><i className="material-icons">&#xE8B8;</i></a>
		    </div>
	    );
    }
});

module.exports = Header;