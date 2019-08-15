import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux';
const jwt = require('jsonwebtoken');
const { changeSubscription } = require('./redux/actions')

class SubscriptionComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        phoneNumber: null,
      }
    }

    componentDidMount() {
        const decoded = jwt.decode(this.props.token);
        this.setState({ 
            phoneNumber: decoded.payload.phoneNumber,
        })
    }

    smsButtonStyle = {
        "border": "none", 
        "background":"none", 
        "color":"blue", 
        "outline":"none"
    }

    changeSubscription = async() => {
        try {
            const subscriptionResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/changeSubscription`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${this.props.token}`
                },
                body: JSON.stringify({
                    subscribed: !this.props.subscribed,
                    phoneNumber: this.state.phoneNumber
                })
            });
            const newSubscription = await subscriptionResponse.json()
            this.props.changeSubscription(newSubscription);
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err)
        }
    }

    render() {
        var subscriptionText;
        if (this.props.subscribed) {
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
        token: state.token,
        subscribed: state.subscribed
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        changeSubscription: subscribed => dispatch(changeSubscription({subscribed: subscribed})),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionComponent);