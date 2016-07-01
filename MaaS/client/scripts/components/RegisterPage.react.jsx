var React = require('react');

var RegisterPage = React.createClass({
    render() {
        return (
        <div>
          <div>
            <form>
              <div className="login-field">
                <label name="email">Email</label>
                <input type="text" name="email" ref="email" /> 
              </div>
              <div className="login-field">
                <label name="password">Password</label>
                <input type="password" name="password" ref="password" />
              </div>
              <button type="submit" className="login-submit">Login</button>
            </form>
          </div>
        </div>
    );
    }
});

module.exports = LoginPage;