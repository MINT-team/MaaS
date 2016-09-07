// Name: {ChangeAvatar.react.jsx}
// Module: {Front-end::Views}
// Location: {/MaaS/client/script/components/Profile/}

// History:
// Version         Date            Programmer
// ==========================================

var React = require('react');
var Dropzone = require('react-dropzone');

var ChangeAvatar = React.createClass({

    getInitialState: function() {
      return {
        image: null
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
    
    onSubmit: function() {
      alert('si');
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
          <Dropzone onDrop={this.onDrop} multiple="false" accept="image/*" id="dropzone" ref="dropzone">
            <div className="dropzone-description">Drag and drop the new image</div>
            <div className="dropzone-description">Or click here to choose it</div>
          </Dropzone>
        );
      }
        return (
          <div className="container sidebar-container">
            <p className="container-title">Avatar</p>
            <form className="form-container">
              <div className="form-field" id="avatar-container">
                <label htmlFor="newAvatar" id="avatar-label">New Avatar</label>
                <div id="dropzone-container">
                  {content}
                </div>
              </div>
              <button onSubmit={this.onSubmit} type="submit" className="form-submit">Change avatar</button>
            </form>
          </div>
        );
    }
});

//<input type="file" id="newAvatar" ref="newAvatar" />

module.exports = ChangeAvatar;