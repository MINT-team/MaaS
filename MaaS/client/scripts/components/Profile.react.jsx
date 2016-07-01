var React = require('react');

var Profile = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Profilo</p>
            <form className="form-container">
              <div className="form-field">
                <label name="nomeAzienda">Nome Azienda</label>
                <input type="text" name="nomeAzienda" ref="nomeAzienda" />
              </div>
              <div className="form-field">
                <label name="email">Email</label>
                <input type="text" name="email" ref="email" />
              </div>
              <div className="form-field">
                <label name="password">Password</label>
                <input type="password" name="password" ref="password" />
              </div>
              <div className="form-field">
                <label name="confermaPassword">Conferma Password</label>
                <input type="confermaPassword" name="confermaPassword" ref="confermaPassword" />
              </div>
              <button type="submit" className="form-submit">Registra la tua azienda</button>
            </form>
          </div>
    );
    }
});

module.exports = Profile;