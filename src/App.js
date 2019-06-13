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

  getcarsData = async() => {
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
    if (this.state.data == null) {
      versionText = "Loading ...";
    } else {
      versionText = this.state.data;
    }

    var carsDisplay;
    if (this.state.cars == null) {
      carsDisplay = <p>"Loading ..."</p>;
    } else {
      carsDisplay = this.state.cars.map((car) => (
        <p>Make:{car.name}  Model:{car.country}  Year:{car.year}  Rating:{car.rating}</p>
      ));
    }
    
    //Look up html forms for getting data about requests

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
        <div>
          {carsDisplay}
        </div>
        <p className="App-intro">Beneath is where request info will be made and appear</p>
      </div>
    );
  }
}

export default App;
