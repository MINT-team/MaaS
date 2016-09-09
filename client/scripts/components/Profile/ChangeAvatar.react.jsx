var React = require('react');
var Dropzone = require('react-dropzone');
// var UserStore = require('../../stores/UserStore.react.jsx');
// var SessionStore = require('../../stores/SessionStore.react.jsx');
// var RequestUserActionCreator = require('../../actions/Request/RequestUserActionCreator.react.jsx');

var ChangeAvatar = React.createClass({

    getInitialState: function() {
      return {
        image: null
        // userId: SessionStore.getUserId()
      };
    },

    onDrop: function (file) {
      this.setState({
        image: file
      });
    },

    openDropzone: function () {
      this.refs.dropzone.open();
    },
    
    _onSubmit: function(e) {
      e.preventDefault();
      // RequestUserActionCreator.changeAvatar(this.state.userId, this.state.image);
      //console.log(this.state.image);
    },

    render: function() {
      var content;
      if(this.state.image)
      {
        content = (
          <div id="preview">
            <img src={this.state.image[0].preview} />
            <p>{this.state.image[0].name}</p>
          </div>
        );
      }
      else
      {
        content = (
          <Dropzone onDrop={this.onDrop} multiple={false} accept="image/*" id="dropzone" ref="dropzone">
            <div className="dropzone-description">Drag and drop the new image</div>
            <div className="dropzone-description">Or click here to choose it</div>
          </Dropzone>
        );
      }
        return (
          <div className="container sidebar-container">
            <p className="container-title">Avatar</p>
            <form onSubmit={this._onSubmit} className="form-container">
              <div className="form-field" id="avatar-container">
                <label htmlFor="newAvatar" id="avatar-label">New Avatar</label>
                <div id="dropzone-container">
                  {content}
                </div>
              </div>
              <button type="submit" className="form-submit">Change avatar</button>
            </form>
          </div>
        );
    }
});

module.exports = ChangeAvatar;