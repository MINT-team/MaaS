var React = require('react');
var Link = require('react-router').Link;

var Login = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Login to MaaS</p>
            <form>
                <div className="form-vertical-block">
                  <label htmlFor="email"><i className="material-icons md-24 input-icon">&#xE853;</i></label>
                  <input type="text" id="email" ref="email" placeholder="Email" className="iconized-input" required/>
                </div>
                <div className="form-vertical-block">
                  <label htmlFor="password"><i className="material-icons md-24 input-icon">&#xE897;</i></label>
                  <input type="password" id="password" ref="password" placeholder="Password" className="iconized-input" required/>
                  <p id="login-help">Password dimenticata? <Link to="/recoverpwd">Impostane una nuova</Link></p>
                </div>
              <button type="submit" className="form-submit">Login</button>
            </form>
          </div>
    );
    }
});

module.exports = Login;