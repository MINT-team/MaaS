var React = require('react');

var PersonalData = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Dati anagrafici</p>
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
                <label htmlFor="date">Data di Nascita</label>
                <input type="date" id="date" ref="date"/>
              </div>
              <div className="form-field">
                <label htmlFor="gender">Sesso</label>
                <div className="form-right-block" id="gender">
                  <label htmlFor="gender-male" className="radio-label">Maschio</label>
                  <input type="radio" name="gender" id="gender-male" ref="gender" value="male"/>
                  <label htmlFor="gender-female" className="radio-label">Femmina</label>
                  <input type="radio" name="gender" id="gender-female" ref="gender" value="female"/>
                </div>
              </div>
              <button type="submit" className="form-submit">Salva i cambiamenti</button>
            </form>
          </div>
        );
    }
});

module.exports = PersonalData;