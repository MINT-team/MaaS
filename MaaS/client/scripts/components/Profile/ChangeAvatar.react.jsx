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
      /*var req = request.post('/upload');
      files.forEach((file)=> {
          req.attach(file.name, file);
      });
      req.end(callback);*/
    },

    openDropzone: function () {
      this.refs.dropzone.open();
    },

    render: function() {
      var content;
      if(this.state.image) {
        content = (
          <div id="preview">
            <img src={this.state.image[0].preview} />
            <p>{this.state.image[0].name}</p>
          </div>
        );
      } else {
        content = (
          <Dropzone onDrop={this.onDrop} multiple="false" accept="image/*" id="dropzone" ref="dropzone">
            <div className="dropzone-description">Trascina qui la nuova immagine</div>
            <div className="dropzone-description">Oppure fai click per sceglierla</div>
          </Dropzone>
        );
      }
        return (
          <div className="container">
            <p className="container-title">Avatar</p>
            <form className="form-container">
              <div className="form-field">
                <label htmlFor="newAvatar" id="avatar-label">Nuovo Avatar</label>
                <div id="dropzone-container">

                  {content}
                </div>
              </div>
              <button type="submit" className="form-submit">Cambia avatar</button>
            </form>
          </div>
        );
    }
});

//<input type="file" id="newAvatar" ref="newAvatar" />

module.exports = ChangeAvatar;