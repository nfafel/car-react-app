import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux';
const jwt = require('jsonwebtoken');

class SubscriptionComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        phoneNumber: null,
        subscribed: null
      }
    }

    componentDidMount() {
        const decoded = jwt.decode(this.props.token);
        this.setState({ 
            phoneNumber: decoded.payload.phoneNumber,
            subscribed: decoded.payload.subscribed 
        })
    }

    smsButtonStyle = {
        "border": "none", 
        "background":"none", 
        "color":"blue", 
        "outline":"none"
    }

    changeSubscription = async() => {
        this.setState({subscribed: !this.state.subscribed})
        try {
            fetch(`https://tranquil-caverns-41069.herokuapp.com/users/${this.state.phoneNumber}/changeSubscription`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subscribed: !this.state.subscribed
                })
            });
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        var subscriptionText;
        if (this.state.subscribed) {
            subscriptionText = 'Unsubscribe from Text Notifications';
        } else {
            subscriptionText = 'Subscribe to Text Notifications';
        }

        return (
            <div style={{"position": "absolute", "bottom":5, "left":0, "right":0}}>
                <button type="button" style={this.smsButtonStyle} onClick={() => this.changeSubscription()} >{subscriptionText}</button>
            </div>
        )
    }
}

const mapStateToProps = function(state) {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(SubscriptionComponent);