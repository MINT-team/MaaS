var React = require('react');
var ReactDOM = require('react-dom');
window.React = React;
var Routes = require('./routes.jsx');


ReactDOM.render(<Routes />, document.getElementById('content'));
/*
var LoginPage = React.createClass({
    render() {
        return (
        <div>
        <div className="row">
          <div className="card card--login small-10 medium-6 large-4 columns small-centered">
            <form>
              <div className="card--login__field">
                <label name="email">Email</label>
                <input type="text" name="email" ref="email" /> 
              </div>
              <div className="card--login__field">
                <label name="password">Password</label>
                <input type="password" name="password" ref="password" />
              </div>
              <button type="submit" className="card--login__submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
    }
});

ReactDOM.render(<LoginPage />, document.getElementById('content'));
*/