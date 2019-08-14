import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CarsComponent from './CarsComponent'
import RepairsComponent from './Rest/RepairsComponent'
import HomeComponent from './Rest/HomeComponent'
import GraphQLRepairsComponent from './GraphQL/GraphQLRepairsComponent'
import GraphQLHomeComponent from './GraphQL/GraphQLHomeComponent'
import { connect } from 'react-redux';

function RestHome() {
  return (
    <div>
      <h2>Last Logged Repairs - REST</h2>
      <HomeComponent />
    </div>
  )
}
  
function RestRepairs() {
  return (
    <div>
      <h2>Repairs - REST</h2>
      <RepairsComponent />
    </div>
  );
}

function GraphQLHome() {
  return (
    <div>
      <h2>Last Logged Repairs - GraphQL</h2>
      <GraphQLHomeComponent />
    </div>
  )
}

function GraphQLRepairs() {
  return (
    <div>
      <h2>Repairs - GraphQL</h2>
      <GraphQLRepairsComponent />
    </div>
  );
}

function Cars(queryType) {
  var queryText = (queryType === 'rest') ? ("REST") : ("GraphQL");
  return (
    <div>
      <h2>Cars - {queryText}</h2>
      <CarsComponent />
    </div>
  );
}
  
class AuthorizedAppRouter extends Component {
  render () {    
    var HomeComponent;
    var RepairsComponent;
    if (this.props.queryType === "rest") {
      HomeComponent = RestHome;
      RepairsComponent = RestRepairs
    } else {
      HomeComponent = GraphQLHome;
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
          <Route path="/cars/" render={() => Cars(this.props.queryType)} />
          <Route path="/repairs/" component={RepairsComponent} />
        </div>
      </Router>
    );
  }
}

const mapStateToProps = function(state) {
  return {
      queryType: state.queryType
  }
}

export default connect(mapStateToProps)(AuthorizedAppRouter);