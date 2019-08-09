import React, {Component} from 'react';
import './App.css';

import { Provider } from "react-redux";
import store from './ReduxState'

import AuthorizedAppRouter from './AuthorizedAppRouter'
import SubscriptionComponent from './SubscriptionComponent'
import LoginComponent from './LoginComponent'
import RegistrationComponent from './RegistrationComponent'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      version: null,
      queryType: "rest",
      user: null,
      newAccountForm: "closed"
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
      <Provider store={store}>
        <div className="App" >
          <header className="App-header">
            <h1 className="App-title" style={{"margin":"0em"}}>Car Repair App</h1>
            <p style={{"margin":"0em"}}>{versionText}</p>
            <p>{store.getState()}</p>
          </header>
          <div style={{float: "right", margin: 5}}>
            <button type="button" style={{fontSize: 15, marginRight: 5, backgroundColor: restButtonColor, outline: "none"}} onClick={() => this.setState({queryType: "rest"})}>REST</button>
            <button type="button" style={{fontSize: 15, backgroundColor: graphQLButtonColor, outline: "none"}} onClick={() => this.setState({queryType: "graphql"})}>GraphQL</button>
          </div>
          {(this.state.user === null) ? 
            (<div style={{height: '70vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
              {(this.state.newAccountForm === "closed") ? 
              (<LoginComponent setUser={(user) => {this.setState({user: user})}} createAccount={() => this.setState({newAccountForm: "open"})} />) 
              : 
              (<RegistrationComponent setUser={(user) => {this.setState({user: user})}} cancel={() => this.setState({newAccountForm: "closed"})} />)} 
            </div>) 
            : 
            (<div>
              <AuthorizedAppRouter queryType={this.state.queryType} user={this.state.user} />
              <SubscriptionComponent queryType={this.state.queryType} user={this.state.user} setUser={(user) => this.setState({user: user})} />
            </div>)
          }
        </div>
      </Provider>
    );
  }
}

export default App;