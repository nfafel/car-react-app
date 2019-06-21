import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      version: null,
      cars: null,
      shouldGetPostData: false,
      shouldGetPutData: false,
      carIdUpdate: null,
      newCarMake: null,
      newCarModel: null,
      newCarYear: null,
      newCarRating: null
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

  callDeleteData(carId) {
    this.deleteData(carId)
      .then(res => this.setState({cars: res.cars}))
      .catch(err => console.log(err));
  }

  deleteData = async(carId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPutData(car) {
    this.setState({
      shouldGetPutData: true,
      carIdUpdate: car._id,
      newCarMake: car.make,
      newCarModel: car.model,
      newCarYear: car.year,
      newCarRating: car.rating
    });
  }

  callPutData(carId) {
    this.putData(carId)
    .then(res => this.setState({ 
        cars: res.cars,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null,
        newCarMake: null,
        newCarModel: null,
        newCarYear: null,
        newCarRating: null
      }))
    .catch(err => console.log(err));
  }

  putData = async(carId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: this.state.newCarMake,
        model: this.state.newCarModel,
        year: this.state.newCarYear,
        rating: this.state.newCarRating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  getPostData() {
    this.setState({shouldGetPostData: true});
  }

  callPostData() {
    this.postData()
      .then(res => this.setState({ 
          cars: res.cars,
          shouldGetPostData: false,
          shouldGetPutData: false,
          carIdUpdate: null,
          newCarMake: null,
          newCarModel: null,
          newCarYear: null,
          newCarRating: null
        }))
      .catch(err => console.log(err));
  }

  postData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: this.state.newCarMake,
        model: this.state.newCarModel,
        year: this.state.newCarYear,
        rating: this.state.newCarRating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  }

  newCarMakeChange(e) {
    this.setState({newCarMake: e.target.value});
  }
  newCarModelChange(e) {
    this.setState({newCarModel: e.target.value});
  }
  newCarYearChange(e) {
    this.setState({newCarYear: e.target.value});
  }
  newCarRatingChange(e) {
    this.setState({newCarRating: e.target.value});
  }

  tableStyles() {
    return ({
      "width": "80%",
      "border-collapse": "collapse",
      "border": "1px solid #dddddd",
      "margin": "1em auto"
    });
  };

  rowColStyles() {
    return ({
      "border-collapse": "collapse",
      "border": "1px solid #dddddd"
    });
  };

  updateRowForm = (carId) => {
    return (
    <tr style={this.rowColStyles()}>
      <td>
        <form>
          <input type="text" name="make" value={this.state.newCarMake} onChange={(e) => this.newCarMakeChange(e)}></input>
        </form>
      </td>
      <td>
        <form>
          <input type="text" name="model" value={this.state.newCarModel} onChange={(e) => this.newCarModelChange(e)}></input>
        </form>
      </td>
      <td>
        <form>
          <input type="text" name="year" value={this.state.newCarYear} onChange={(e) => this.newCarYearChange(e)}></input>
        </form>
      </td>
      <td>
        <form>
          <input type="text" name="rating" value={this.state.newCarRating} onChange={(e) => this.newCarRatingChange(e)}></input>
        </form>
      </td>
      <td><button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callPutData(carId)}>UPDATE</button> </td>
    </tr>);
  }

  newCarForm() {
    return (
      <tr style={this.rowColStyles()}>
        <td>
          <form>
            <input type="text" name="make" value={this.state.newCarMake} onChange={(e) => this.newCarMakeChange(e)}></input>
          </form>
        </td>
        <td>
          <form>
            <input type="text" name="model" value={this.state.newCarModel} onChange={(e) => this.newCarModelChange(e)}></input>
          </form>
        </td>
        <td>
          <form>
            <input type="text" name="year" value={this.state.newCarYear} onChange={(e) => this.newCarYearChange(e)}></input>
          </form>
        </td>
        <td>
          <form>
            <input type="text" name="rating" value={this.state.newCarRating} onChange={(e) => this.newCarRatingChange(e)}></input>
          </form>
        </td>
        <td>
          <button type="button" style={{"margin-bottom":"1em"}} onClick={() => {this.setState({shouldGetPostData: false});}}>CANCEL</button>
          <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callPostData()}>SUMBIT</button> 
        </td>
      </tr>
      );
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
      carsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
    } else {
      carsDisplay = this.state.cars.map((car) => { 
        if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
          return (this.updateRowForm(car._id));
        } else {
          return (
          <tr style={this.rowColStyles()}>
            <td>{car.make}</td>
            <td>{car.model}</td>
            <td>{car.year}</td>
            <td> {car.rating} </td>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(car)}>EDIT</button>
            <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(car._id)}>DELETE</button> 
          </tr>)
        }
      });
      if (this.state.shouldGetPostData) {
        carsDisplay.push([this.newCarForm()]);
      }
    }

    return(
      <div className="App">
        <header className="App-header" style={{"height":"50%"}}>
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <p>{versionText}</p>
        </header>

        <table style={this.tableStyles()}>
          <tr style={this.rowColStyles()}>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
          {carsDisplay}
        </table>

        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData()}>NEW CAR</button>

      </div>
    );
  }
}

export default App;
