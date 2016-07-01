var React = require('react');

var RecoverPwd = React.createClass({
    render() {
        return (
          <div>
            <form>
              <div className="recover-field">

                <label name="userName">UserName</label>
                <input type="text" name="userName" ref="userName" />

                <label name="password">Password</label>
                <input type="password" name="password" ref="password" />

                <label name="confermaPassword">Confirm Password</label>
                <input type="confermaPassword" name="confermaPassword" ref="confermaPassword" />

              </div>
              <button type="submit" className="recover-submit">Send</button>
            </form>
          </div>
    );
    }
});

module.exports = RecoverPwd;