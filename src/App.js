import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: null
    }
  }
  
  componentDidMount() {
    //this.callBackendAPI()
    //  .then(res => this.setState({ data: res.version }))
    //  .catch(err => console.log(err));
  }
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  callBackendAPI = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  render() {
      //"proxy": "http://localhost:5000/"
      //"proxy": "https://tranquil-caverns-41069.herokuapp.com/"

    var versionText;
    if (this.state.data == null) {
      versionText = "Loading ...";
    } else {
      versionText = this.state.data;
    }

    return(
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <p>{versionText}</p>
        </header>
      
        <p className="App-intro"></p>
      </div>
    );
  }
}

export default App;
