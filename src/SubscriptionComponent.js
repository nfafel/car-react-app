import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'

class SubscriptionComponent extends Component {

    constructor(props){
      super(props);
      this.state = {
        SMSSubscriptionForm: "closed",
        SMSConfirmationForm: "closed",
        confirmationNumber: null,
        phoneNumber: null,
        incorrectGuesses: 0
      }
    }

    smsButtonStyle = {
        "border": "none", 
        "background":"none", 
        "color":"blue", 
        "outline":"none"
    }
    
    formStyle = {
        "position": "absolute", 
        "bottom":5, 
        "left":0, 
        "right":0,
        "marginLeft":"auto", 
        "marginRight":"auto", 
        "border": "solid", 
        "backgroundColor": "#cdf6f7", 
        "width": 500
    }
    
    PhoneNumberValidationSchema = Yup.object().shape({
        phoneNumber: Yup.string()
          .required('Required')
          .matches(/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/, 'Required Format: (XXX)-XXX-XXXX'),
    })

    ConfirmationNumberValidationSchema = Yup.object().shape({
        enteredConfirmationNumber: Yup.number()
          .required('Required')
          .typeError('Must Enter a Number')
    })

    sendConfirmation = (phoneNumber) => {
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
        this.setState({
          confirmationNumber: confirmationNumber,
          phoneNumber: parsedNumber,
          SMSSubscriptionForm: "closed",
          SMSConfirmationForm: "open"
        })
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/sendConfirmation/1${parsedNumber}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                confirmationNumber: confirmationNumber.toString()
            })
        });
    }

    confirmSubscription = (enteredConfirmationNumber) => {
        if (enteredConfirmationNumber === this.state.confirmationNumber) {
            fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/subscribe/1${this.state.phoneNumber}`, {
                method: 'POST',
            });
            this.setState({
                SMSConfirmationForm: "closed",
                confirmationNumber: null,
                phoneNumber: null
            });
        } else {
            if (this.state.incorrectGuesses < 2) {
                alert("The confirmation number you provided is incorrect. Please try again.")
                this.setState({
                    incorrectGuesses: this.state.incorrectGuesses+1
                })
            } else {
                alert("You have provided the confirmation number incorrectly too many times. If you would still like to subscribe, please try again.")
                this.setState({
                    incorrectGuesses: 0,
                    SMSConfirmationForm: "closed"
                })
            }
        }
    }

    render() {

        if (this.state.SMSSubscriptionForm === "closed" && this.state.SMSConfirmationForm === "closed") {
            return (
                <div style={{"position": "absolute", "bottom":5, "left":0, "right":0}}>
                    <button type="button" style={this.smsButtonStyle} onClick={() => this.setState({SMSSubscriptionForm: "open"})}>Subscribe to Text Notifications</button>
                </div>
            )
        } else {
            var SMSForm;
            if (this.state.SMSSubscriptionForm === "open") {
                SMSForm = (
                    <Formik
                        initialValues = {{phoneNumber: ''}}
                        validationSchema={this.PhoneNumberValidationSchema}
                        onSubmit = {(values) => this.sendConfirmation(values.phoneNumber)}
                    >
                    {(props) => (
                        <Form>
                            <p>To recieve text notifications regarding new cars and repairs,<br/> enter your phone number below:</p>
                            <Field type="tel" name="phoneNumber" placeholder="(XXX)-XXX-XXXX"/>
                            <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                            <div style={{"margin": 15}}>
                                <button type="button" onClick={() => this.setState({SMSSubscriptionForm: "closed"})}>Close</button>
                                <button type="submit">Subscribe</button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                )
            } else {
                SMSForm = (
                    <Formik
                        initialValues = {{enteredConfirmationNumber: ''}}
                        validationSchema={this.ConfirmationNumberValidationSchema}
                        onSubmit = {(values) => this.confirmSubscription(values.enteredConfirmationNumber)}
                    >
                    {(props) => (
                        <Form>
                            <p>Enter the Confirmation Number Sent to {this.state.phoneNumber}</p>
                            <Field type="number" name="enteredConfirmationNumber" placeholder=""/>
                            <ErrorMessage name="enteredConfirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                            <div style={{"margin": 15}}>
                                <button type="button" onClick={() => this.setState({SMSConfirmationForm: "closed", phoneNumber: null, confirmationNumber: null})}>Cancel</button>
                                <button type="submit">Confirm</button>
                            </div>
                        </Form>
                    )}
                    </Formik>
                )
            }

            return (
                <div style={this.formStyle}>
                    {SMSForm}
                </div>
            )
        }
    }


}

export default SubscriptionComponent;