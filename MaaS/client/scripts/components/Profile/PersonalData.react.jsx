// Name: {PersonalData.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Profile/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Link = require('react-router').Link;
var SessionStore = require('../../stores/SessionStore.react.jsx');
var UserStore = require('../../stores/UserStore.react.jsx');
var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

function getState() {
  return {
          name: UserStore.getName(),
          surname: UserStore.getSurname(),
          dateOfBirth: UserStore.getDateOfBirth(),
          gender: UserStore.getGender(),
          errors: UserStore.getErrors(),
          email: UserStore.getEmail()
      };
}

function getDateOfBirth(d) {
  var date, year, month, day;
  year = d.getFullYear();
  month = d.getMonth()+1; //getMonth -> 0-11
  day = d.getDate();      //getDate -> 1-31
  if(month < 10) {
    month = '0'+month;
  }
  if(day < 10) {
    day = '0'+day;
  }
  date = year+'-'+month+'-'+day;
  return date;
}

var PersonalData = React.createClass({

  getInitialState: function() {
      return {
        name: UserStore.getName(),
        surname: UserStore.getSurname(),
        dateOfBirth: UserStore.getDateOfBirth(),
        gender: UserStore.getGender(),
        radioGender: UserStore.getGender(),
        errors: [],
        email: null
      };
  },

  componentDidMount: function() {
      UserStore.addChangeListener(this._onChange);
      this.refs.nome.value = this.state.name;
      this.refs.cognome.value = this.state.surname;
      this.refs.date.value = getDateOfBirth(this.state.dateOfBirth);
      if(this.state.gender == "male") {
        this.refs.gender_male.checked = "true";
      }
      if(this.state.gender == "female") {
        this.refs.gender_female.checked = "true";
      }
  },

  componentWillUnmount: function() {
      UserStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
      this.setState(getState());
  },

  _onSubmit: function(event) {
      event.preventDefault();   //evita il ricaricamento della pagina da parte della form
      var name = this.refs.nome.value;
      var surname = this.refs.cognome.value;
      var dateOfBirth = this.refs.date.value;
      var gender = this.state.radioGender;
      // call the action only if something has changed
      if(name!=this.state.name || surname!=this.state.surname || dateOfBirth!=getDateOfBirth(this.state.dateOfBirth) || gender!=this.state.gender) {
        RequestUserActionCreator.changePersonalData(SessionStore.getUserId(), name, surname, dateOfBirth, gender);
      } else {
        this._setError("No changes to save");
      }
  },

  _setError: function(error) {
    this.setState({
      isRegistered: this.state.isRegistered,
      errors: error
    });
  },

  radioChange: function(event) {
    const val = event.target.value;
    console.log(event.target);
    this.setState({ radioGender: val });
  },

  render: function() {
    var title, content, errors;
    if(!this.state.email || this.state.errors.length > 0) {
      title = "Personal data";
      if(this.state.errors.length > 0) {
        errors = (
          <p id="errors">{this.state.errors}</p>
        );
      }
      content = (
        <form onSubmit={this._onSubmit} className="form-container">
          <div className="form-field">
            <label htmlFor="nome">Name</label>
            <input type="text" id="nome" ref="nome" />
          </div>
          <div className="form-field">
            <label htmlFor="cognome">Surname</label>
            <input type="text" id="cognome" ref="cognome" />
          </div>
          <div className="form-field">
            <label htmlFor="date">Date of birth</label>
            <input type="date" id="date" ref="date"/>
          </div>
          <div className="form-field">
            <label htmlFor="gender">Gender</label>
            <div className="form-right-block" id="gender">
              <label htmlFor="gender-male" className="radio-label">Male</label>
              <input type="radio" name="gender" id="gender-male" ref="gender_male" value="male" onChange={this.radioChange} />
              <label htmlFor="gender-female" className="radio-label">Female</label>
              <input type="radio" name="gender" id="gender-female" ref="gender_female" value="female" onChange={this.radioChange} />
            </div>
          </div>
          {errors}
          <button type="submit" className="form-submit">Save changes</button>
        </form>
      );
    } else {
      title = "Personal data changed";
      content = (
        <div id="successful-operation">
          <p>Your personal data has been changed successfully.</p>
          <Link id="successful-button" className="button" to="/profile">Back to your profile</Link>
        </div>
      );
    }
    return (
      <div className="container">
        <p className="container-title">{title}</p>
        {content}
      </div>
    );
  }
});

module.exports = PersonalData;