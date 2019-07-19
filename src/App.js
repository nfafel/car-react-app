import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CarsComponent from './CarsComponent'
import RepairsComponent from './RepairsComponent'
import HomeComponent from './HomeComponent'
import GraphQLRepairsComponent from './GraphQLRepairsComponent'
import GraphQLHomeComponent from './GraphQLHomeComponent'

function RestHome() {
  return (
    <div>
      <h2>Last Logged Repairs</h2>
      <HomeComponent />
    </div>
  )
}

function RestCars() {
  return (
    <div>
      <h2>Cars</h2>
      <CarsComponent queryFuncFile={"./queryFuncForCarsComponent"} />
    </div>
  );
}

function RestRepairs() {
  return (
    <div>
      <h2>Repairs</h2>
      <RepairsComponent />
    </div>
  );
}

function GraphQLHome() {
  return (
    <div>
      <h2>Last Logged Repairs</h2>
      <GraphQLHomeComponent />
    </div>
  )
}

function GraphQLCars() {
  return (
    <div>
      <h2>Cars</h2>
      <CarsComponent queryFuncFile={"./graphQLQueriesForCars"} />
    </div>
  );
}

function GraphQLRepairs() {
  return (
    <div>
      <h2>Repairs</h2>
      <GraphQLRepairsComponent />
    </div>
  );
}

class AppRouter extends Component {
  render () {
    var HomeComponent;
    var CarsComponent;
    var RepairsComponent;
    if (this.props.queryType == "rest") {
      HomeComponent = RestHome;
      CarsComponent = RestCars
      RepairsComponent = RestRepairs
    } else {
      HomeComponent = GraphQLHome;
      CarsComponent = GraphQLCars
      RepairsComponent = GraphQLRepairs
    }

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

          <Route path="/" exact component={HomeComponent} />
          <Route path="/cars/" component={CarsComponent} />
          <Route path="/repairs/" component={RepairsComponent} />
        </div>
      </Router>
    );
  }
}

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      version: null,
      queryType: "rest"
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

    var graphQLButtonColor;
    var restButtonColor;
    if (this.state.queryType === "rest") {
      graphQLButtonColor = "white";
      restButtonColor = "Cyan";
    } else {
      graphQLButtonColor = "Cyan";
      restButtonColor = "white";
    }

    return(
      <div className="App">
        <header className="App-header">
          <h1 className="App-title" style={{"margin":"0em"}}>Car Repair Editor</h1>
          <p style={{"margin":"0em"}}>{versionText}</p>
        </header>
        <div style={{"float": "right", "margin": 5}}>
          <button type="button" style={{fontSize: 15, marginRight: 5, backgroundColor: restButtonColor, outline: "none"}} onClick={() => this.setState({queryType: "rest"})}>Rest</button>
          <button type="button" style={{fontSize: 15, backgroundColor: graphQLButtonColor, outline: "none"}} onClick={() => this.setState({queryType: "graphql"})}>GraphQL</button>
        </div>
        <AppRouter queryType={this.state.queryType} />
      </div>
    );
  }
}

export default App;
