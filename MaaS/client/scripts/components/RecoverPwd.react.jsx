var React = require('react');

var RecoverPwd = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Choose a new Password</p>
            <form className="form-container">
              <div className="form-field">
                <label htmlFor="userName">Email</label>
                <input type="text" id="userName" ref="email" />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref="password" />
              </div>
              <div className="form-field">
                <label htmlFor="confermaPassword">Confirm Password</label>
                <input type="password" id="confermaPassword" ref="confermaPassword" />
              </div>
              <button type="submit" className="form-submit">Send</button>
            </form>
          </div>
    );
    }
});

module.exports = RecoverPwd;