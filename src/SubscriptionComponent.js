import React, {Component} from 'react';
import './App.css';
import { connect } from 'react-redux';

class SubscriptionComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        subscribed: this.props.user.subscribed
      }
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
            fetch(`https://tranquil-caverns-41069.herokuapp.com/users/${this.props.user.phoneNumber}/changeSubscription`, {
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
        if (this.state.subscribed === false) {
            subscriptionText = 'Subscribe to Text Notifications';
        } else {
            subscriptionText = 'Unsubscribe from Text Notifications';
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
        user: state.user
    }
}

export default connect(mapStateToProps)(SubscriptionComponent);