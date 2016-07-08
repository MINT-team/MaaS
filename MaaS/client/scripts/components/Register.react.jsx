var React = require('react');
//var Header = require('./Header.react.jsx');

var Register = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Sign Up to MaaS</p>
            <form className="form-container">
              <div className="form-field">
                <label htmlFor="nomeAzienda">Nome Azienda</label>
                <input type="text" id="nomeAzienda" ref="nomeAzienda" />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" ref="email" />
              </div>
              <div className="form-field">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref="password" />
              </div>
              <div className="form-field">
                <label htmlFor="confermaPassword">Conferma Password</label>
                <input type="password" id="confermaPassword" ref="confermaPassword" />
              </div>
              <button type="submit" className="form-submit">Registra la tua azienda</button>
            </form>
          </div>
    );
    }
});

module.exports = Register;