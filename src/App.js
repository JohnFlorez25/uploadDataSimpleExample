import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append('file', this.state.selectedFile);

    axios.post("http://localhost:8000/upload", data, { 
     
      // receive two parameter endpoint url ,form data 
      
    })
      .then(res => { // then print response status
        console.log(res.statusText)
      })
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
            <button
              type="button"
              className="btn btn-success btn-block"
              onClick={this.onClickHandler}
            >
              Cargar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
