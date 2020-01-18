import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Progress } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    };
  }

  //Máximo adjuntar una única imagen
  maxSelectFile = event => {
    let files = event.target.files; // create file object
    if (files.length > 1) {
      const msg = 'Only 1 images can be uploaded at a time';
      event.target.value = null; // discard selected file
      console.log(msg);
      return false;
    }
    return true;
  };

  //Verificar la extensión del archivo a subir
  checkMimeType = event => {
    //getting file object
    let files = event.target.files;
    //define message container
    let err = '';
    // list allow mime type
    const types = ['image/png', 'image/jpeg', 'application/pdf'];
    // loop access array
    for (var x = 0; x < files.length; x++) {
      // compare file type find doesn't matach
      if (types.every(type => files[x].type !== type)) {
        // create error message and assign to container
        err += files[x].type + ' is not a supported format\n';
      }
    }

    if (err !== '') {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      console.log(err);
      return false;
    }
    return true;
  };

  //Poner límite de tamaño
  checkFileSize = event => {
    let files = event.target.files;
    let size = 15000000;
    let err = '';
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err += files[x].type + 'is too large, please pick a smaller file\n';
      }
    }
    if (err !== '') {
      event.target.value = null;
      console.log(err);
      return false;
    }

    return true;
  };

  onChangeHandler = event => {
    if (
      this.maxSelectFile(event) &&
      this.checkMimeType(event) &&
      this.checkFileSize(event)
    ) {
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0
      });
    }
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);

    axios
      .post('http://localhost:8000/upload', data, {
        // receive two parameter endpoint url ,form data
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      })
      .then(res => {
        // then print response status
        toast.success('upload success');
        console.log(res.statusText);
      })
      .catch(err => {
        toast.error('upload fail');
      });
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="offset-md-3 col-md-6">
            <div className="form-group files color">
              <label>Cargue su archivo </label>
              <input
                className="form-control"
                multiple=""
                type="file"
                name="file"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group">
              <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
              </Progress>
            </div>
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={this.onClickHandler}
            >
              Cargar
            </button>
          </div>
        </div>
        <div className="form-group">
          <ToastContainer />
        </div>
      </div>
    );
  }
}

export default App;
