var React = require('react');
var Slider = require('react-slick');

var Home = React.createClass({
	render: function () {
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
	    	<div className="container">
		        <Slider {...settings}>
		        	<div><img src="../images/text1.gif" alt=""/></div>
		        	<div><img src="../images/text2.gif" alt=""/></div>
		        	<div><img src="../images/text3.gif" alt=""/></div>
		        </Slider>
	    	</div>
		</div>
    );
  }
});

module.exports = Home;


    /*render: function() {
        return (
	        <div class="container">
				<div class="codrops-top">
	                <a href="http://tympanus.net/Tutorials/ItemBlur/">
	                    <strong>&laquo; Previous Demo: </strong>Item Blur Effect
	                </a>
	                <span class="right">
						<a href="http://www.behance.net/qstra" target="_blank">Images by Joanna Kustra</a>
	                    <a href="http://tympanus.net/codrops/2011/12/19/experimental-css3-animations-for-image-transitions/">
	                        <strong>Back to the Codrops Article</strong>
	                    </a>
	                </span>
	                <div class="clr"></div>
	            </div>
				<header>
					<h1>Experimental <span>CSS3</span> Animations <span>for (3D) Image Transitions <strong id="message">Webkit only!</strong></span></h1>
					<p class="codrops-demos">
						<a class="current-demo" href="index.html">Flip</a>
						<a href="index2.html">Rotation</a>
						<a href="index3.html">Multi-flip</a>
						<a href="index4.html">Cube</a>
						<a href="index5.html">Unfold</a>
						<a href="index6.html">Others</a>
					</p>
				</header>

				<div class="te-container">

					<div class="te-controls">
						<select id="type">
							<option value="te-flip1">Flip 1</option>
							<option value="te-flip2">Flip 2</option>
							<option value="te-flip3">Flip 3</option>
							<option value="te-flip4">Flip 4</option>
						</select>
						<a id="te-next" href="#" class="te-next">next</a>
						<div class="te-shadow"></div>
					</div>

					<div id="te-wrapper" class="te-wrapper">

						<div class="te-images">
							<img src="images/1.jpg"/>
							<img src="images/2.jpg"/>
							<img src="images/3.jpg"/>
							<img src="images/4.jpg"/>
							<img src="images/5.jpg"/>
						</div>

						<div class="te-cover">
							<img src="images/1.jpg"/>
						</div>

						<div class="te-transition">
							<div class="te-card">
								<div class="te-front"></div>
								<div class="te-back"></div>
							</div>
						</div>

					</div>

				</div>
	        </div>
        );
    }*/

