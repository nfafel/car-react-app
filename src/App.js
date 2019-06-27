import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CarsComponent from './CarsComponent'
import RepairsComponent from './RepairsComponent'

function Index() {
  return <h2>Home</h2>;
}

function Cars() {
  return (
    <div>
      <h2>Cars</h2>
      <CarsComponent />
    </div>
  );
}

function Repairs() {
  return (
    <div>
      <h2>Repairs</h2>
      <RepairsComponent />
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <table style={{"width":'30%'}}>
            <tr>
              <th><Link to="/">Home</Link></th>
              
              <th><Link to="/cars/">Cars</Link></th>
              
              <th><Link to="/repairs/">Repairs</Link></th>
              
            </tr>
          </table>
        </nav>

        <Route path="/" exact component={Index} />
        <Route path="/cars/" component={Cars} />
        <Route path="/repairs/" component={Repairs} />
      </div>
    </Router>
  );
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      version: null
    }
  }

  componentDidMount() {
    this.getVersionData()
      .then(res => this.setState({ version: res.version }))
      .catch(err => console.log(err));

  }

  getVersionData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/version');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
  };

  render() {

    var versionText;
    if (this.state.version == null) {
        versionText = "Loading ...";
    } else {
        versionText = this.state.version;
    }

    return(
      <div className="App">
        <header className="App-header">
          <h1 className="App-title" style={{"margin":"0em"}}>Car Repair Editor</h1>
          <p style={{"margin":"0em"}}>{versionText}</p>
        </header>
        <AppRouter />
      </div>
    );
  }
}

export default App;
