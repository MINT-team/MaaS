var React = require('react');

var Login = React.createClass({
    render() {
        return (
          <div className="container">
            <p className="container-title">Login to MaaS</p>
            <form>
                <div className="form-field">
                  <label name="email"><i className="material-icons md-24 input-icon">&#xE853;</i></label>
                  <input type="text" name="email" ref="email" placeholder="Email" className="iconized-input"/>
                </div>
                <div className="form-field">
                  <label name="password"><i className="material-icons md-24 input-icon">&#xE897;</i></label>
                  <input type="password" name="password" ref="password" placeholder="Password" className="iconized-input"/>
                </div>
              <button type="submit" className="form-submit">Login</button>
            </form>
          </div>
    );
    }
});

module.exports = Login;