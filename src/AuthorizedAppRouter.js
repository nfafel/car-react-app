import React, {Component} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import CarsComponent from './CarsComponent'
import RepairsComponent from './RepairsComponent'
import HomeComponent from './HomeComponent'
import GraphQLRepairsComponent from './GraphQLRepairsComponent'
import GraphQLHomeComponent from './GraphQLHomeComponent'

function RestHome(user) {
    return (
      <div>
        <h2>Last Logged Repairs - REST</h2>
        <HomeComponent user={user} />
      </div>
    )
  }
  
  function RestCars(user) {
    return (
      <div>
        <h2>Cars - REST</h2>
        <CarsComponent user={user} queryFuncType={"rest"} />
      </div>
    );
  }
  
  function RestRepairs(user) {
    return (
      <div>
        <h2>Repairs - REST</h2>
        <RepairsComponent user={user} />
      </div>
    );
  }
  
  function GraphQLHome(user) {
    return (
      <div>
        <h2>Last Logged Repairs - GraphQL</h2>
        <GraphQLHomeComponent user={user} />
      </div>
    )
  }
  
  function GraphQLCars(user) {
    return (
      <div>
        <h2>Cars - GraphQL</h2>
        <CarsComponent user={user} queryFuncType={"graphql"} />
      </div>
    );
  }
  
  function GraphQLRepairs(user) {
    return (
      <div>
        <h2>Repairs - GraphQL</h2>
        <GraphQLRepairsComponent user={user} />
      </div>
    );
  }
  
  class AuthorizedAppRouter extends Component {
    render () {
      var HomeComponent;
      var CarsComponent;
      var RepairsComponent;
      if (this.props.queryType === "rest") {
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
  
            <Route path="/" exact render={() => HomeComponent(this.props.user)} />
            <Route path="/cars/" render={() => CarsComponent(this.props.user)} />
            <Route path="/repairs/" render={() => RepairsComponent(this.props.user)} />
          </div>
        </Router>
      );
    }
}

export default AuthorizedAppRouter;