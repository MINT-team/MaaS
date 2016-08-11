// Name: {Home.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Slider = require('react-slick');

var Home = React.createClass({
	render() {
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
		        	<div><img src="../images/dsl.png" alt=""/></div>
		        	<div><img src="../images/editor.png" alt=""/></div>
		        	<div><img src="../images/database.png" alt=""/></div>
		        </Slider>
	    	</div>
		</div>
    );
  }
});

module.exports = Home;