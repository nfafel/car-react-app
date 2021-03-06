import React, {Component} from 'react';
import './App.css';

import { connect } from "react-redux";

import AuthorizedAppRouter from './AuthorizedAppRouter'
import SubscriptionComponent from './SubscriptionComponent'
import LoginComponent from './LoginComponent'
import LogoutComponent from './LogoutComponent'
import RegistrationComponent from './RegistrationComponent'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      version: null,
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

    return(
      <div className="App" >
        <header className="App-header">
          <h1 className="App-title" style={{"margin":"0em"}}>Car Repair App</h1>
          <p style={{"margin":"0em"}}>{versionText}</p>
        </header>
        {(this.props.token === "") ? 
          (<div style={{height: '70vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            {(this.state.newAccountForm === "closed") ? 
            (<LoginComponent createAccount={() => this.setState({newAccountForm: "open"})} />) 
            : 
            (<RegistrationComponent cancel={() => this.setState({newAccountForm: "closed"})} />)} 
          </div>) 
          : 
          (<div>
            <LogoutComponent />
            <AuthorizedAppRouter />
            <SubscriptionComponent />
          </div>)
        }
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    token: state.token,
  }
}

export default connect(mapStateToProps)(App);