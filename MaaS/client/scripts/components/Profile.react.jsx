var React = require('react');

var Profile = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Profilo</p>
            <form className="form-container">
              <div className="form-field">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" ref="nome" />
              </div>
              <div className="form-field">
                <label htmlFor="cognome">Cognome</label>
                <input type="text" id="cognome" ref="nome" />
              </div>
              <div className="form-field">
                <label htmlFor="azienda">Azienda</label>
                <input type="text" id="azienda" ref="nomeAzienda" disabled="disabled"/>
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="text" id="email" ref="email" />
              </div>
              <div className="form-field">
                <label htmlFor="password">Nuova Password</label>
                <input type="password" id="password" ref="password" />
              </div>
              <div className="form-field">
                <label htmlFor="confermaPassword">Conferma Password</label>
                <input type="confermaPassword" id="confermaPassword" ref="confermaPassword" />
              </div>
              <button type="submit" className="form-submit">Salva i cambiamenti</button>
            </form>
          </div>
    );
    }
});

module.exports = Profile;