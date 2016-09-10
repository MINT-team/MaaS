var React = require('react');
var Slider = require('react-slick');

var SessionStore = require('../stores/SessionStore.react.jsx');
var UserStore = require('../stores/UserStore.react.jsx');

var Home = React.createClass({
	
	contextTypes: {
      router: React.PropTypes.object.isRequired
    },
	
	getInitialState: function() {
		return {
			isLogged: SessionStore.isLogged(),
        	userType:SessionStore.whoIam(),
        	activeDashboard: UserStore.getActiveDashboard()
		};
	},
	
	componentWillMount: function() {
		if(this.state.isLogged)
    	{
        	const { router } = this.context;
        	if(this.state.userType == "commonUser")
        	{
        		if (this.state.activeDashboard == "default")
        		{
            		router.push('/manageDSL');   // redirect to DSL page
        		}
        		else if (this.state.activeDashboard)
        		{
            		router.push('/manageDSL/executeDSL/'+ this.state.activeDashboard);      // redirect to Dashboard page
        		}
        	}
        	else //redirect for Super Admin
        	{
        		router.push('/dashboardSuperAdmin');   // redirect to Super Admin Dashboard page
        	}
    	}
	},
	
	render: function() {
		var settings = {
	  		accessibility: true,
	    	dots: true,
	    	slidesToShow: 1,
	    	autoplay: true,
			autoplaySpeed: 5000,
			cssEase: 'ease',
			speed: 1000,
			centerMode: true,
			adaptiveHeight: false,
			prevArrow: <div><i className="material-icons md-36">&#xE5CB;</i></div>,
			nextArrow: <div><i className="material-icons md-36">&#xE5CC;</i></div>
	    };

	    return (
	    	<div id="home">
		    	<h1 id="home-title">MongoDB as an Admin Service</h1>
		    	<p id="home-description">MaaS is the Software as a Service you need</p>
		    	<div id="home-container">
			        <Slider {...settings}>
			        	<div><img src="../dist/images/dsl.png" alt=""/></div>
			        	<div><img src="../dist/images/editor.png" alt=""/></div>
			        	<div><img src="../dist/images/database.png" alt=""/></div>
			        </Slider>
		    	</div>
			</div>
	    );
  }
});

module.exports = Home;