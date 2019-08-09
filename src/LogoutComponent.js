import React, {Component} from 'react';
import './App.css';
import {logoutUser} from './redux/actions';
import { connect } from 'react-redux';

class LogoutComponent extends Component {

    render() {
        return (
            <div style={{float: 'right'}}>
                <button type="button" style={{ margin: 10, height: 30, width: 70, fontSize: 16}} onClick={() => this.props.logoutUser()}>Logout</button>
            </div>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}
  
export default connect(null, mapDispatchToProps)(LogoutComponent);