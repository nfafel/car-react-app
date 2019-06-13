import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      version: null,
      cars: null
    }
  }
  
  componentDidMount() {
    this.getVersionData()
      .then(res => this.setState({ version: res.version }))
      .catch(err => console.log(err));

      this.getCarsData()
        .then(res => this.setState({ cars: res.cars }))
        .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  getVersionData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  getDeleteData(){

  }

  getPutData() {

  }

  getPostData() {

  }

  render() {

    var versionText;
    if (this.state.version == null) {
      versionText = "Loading ...";
    } else {
      versionText = this.state.version;
    }

    var carsDisplay;
    if (this.state.cars == null) {
      carsDisplay = <p>"Loading ..."</p>;
    } else {
      carsDisplay = this.state.cars.map((car) => (
        <tr>
          <td>{car.make}</td>
          <td>{car.model}</td>
          <td>{car.year}</td>
          <td>{car.rating}</td>
        </tr>
      ));
    }
    
    //Look up html forms for getting data about requests

    const tableStyles = {
      "width": "100%",
      "border-collapse": "collapse",
      "border": "1px solid"
    }

    const rowStyles = {

    }

    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <p>{versionText}</p>
        </header>

        <button type="button" onclick="getGetData()">GET</button>
        <button type="button" onclick="getPostData()">POST</button>
        <button type="button" onclick="getPutData()">PUT</button>
        <button type="button" onclick="getDeleteData()">DELETE</button>

        <table style={tableStyles}>
          <tr>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Rating</th>
          </tr>
          {carsDisplay}
        </table>

      </div>
    );
  }
}

export default App;
