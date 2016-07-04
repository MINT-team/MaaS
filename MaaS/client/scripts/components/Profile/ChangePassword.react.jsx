var React = require('react');

var ChangePassword = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Password</p>
            <form className="form-container">
              <div className="form-field">
                <label htmlFor="password">Nuova Password</label>
                <input type="password" id="password" ref="password" />
              </div>
              <div className="form-field">
                <label htmlFor="confermaPassword">Conferma Password</label>
                <input type="password" id="confermaPassword" ref="confermaPassword" />
              </div>
              <button type="submit" className="form-submit">Cambia password</button>
            </form>
          </div>
        );
    }
});

module.exports = ChangePassword;