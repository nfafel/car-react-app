import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {loginUser} from './redux/actions';

class RegistrationComponent extends Component {

    constructor(props){
        super(props);
        this.state = {
            registrationForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            incorrectGuesses: 0
        }
    }
    
    formStyle = { 
        "border": "solid", 
        "backgroundColor": "#cdf6f7", 
        "width": 500
    }

    registrationValidationSchema = () => {
        if (this.state.registrationForm === "open") {
            return (
                Yup.object().shape({
                    phoneNumber: Yup.string()
                        .required('Required')
                        .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                }) 
            )
        } 

        return (
            Yup.object().shape({
                phoneNumber: Yup.string()
                    .required('Required')
                    .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                confirmationNumber: Yup.number()
                    .required('Required')
                    .typeError('Must Enter a Number'),
                password: Yup.string()
                    .required('Required'),
                confirmPassword: Yup.string()
                    .required('Required')
                    .oneOf([Yup.ref('password'), null], "Passwords Don't Match")
            }) 
        )
        
    } 

    checkAvailability = async(phoneNumber) => {
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");
        parsedNumber = "1" + parsedNumber
        const availabilityResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/${parsedNumber}/availability`)
        const body = await availabilityResponse.json();

        if (body.available) {
            this.sendConfirmation(parsedNumber);
        } else {
            alert("An account already exists under the entered phone number.")
        }
    }

    sendConfirmation = (parsedNumber) => {
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
        this.setState({
            confirmationNumber: confirmationNumber,
            phoneNumber: parsedNumber,
            registrationForm: "closed",
            confirmationForm: "open"
        })
        alert(confirmationNumber)
        // fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${parsedNumber}/sendConfirmation`, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         confirmationNumber: confirmationNumber.toString()
        //     })
        // });
    }

    confirmRegistration = async(values) => {
        if (parseInt(values.confirmationNumber) === this.state.confirmationNumber) {
            const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: this.state.phoneNumber,
                    password: values.password,
                    subscribed: false
                })
            });
            const body = await response.json();
            this.props.loginUser(body.token);
            this.props.cancel();
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

    getFormFields = (values) => {
        if (this.state.registrationForm === 'open') {
            return (
                <div>
                    <p style={{fontSize: 25, margin: 12}}>Registration</p>
                    <p>Enter your phone number below. <br/> It will act as your username:</p>
                    <Field type="tel" name="phoneNumber" placeholder="(XXX)-XXX-XXXX" style={{height: 20, fontSize: 12}} />
                    <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                </div>
            )
        } else {
            return (
                <div>
                    <p>Enter the confirmation number sent to the number below, <br/> and your desired password:</p>
                    <div>
                        <input value={values.phoneNumber} readOnly style={{height: 20, fontSize: 12}} />
                    </div>
                    <div style={{marginTop: 15}}>
                        <Field type="numeric" name="confirmationNumber" placeholder="Confirmation Number" style={{height: 20, fontSize: 12}}/>
                        <ErrorMessage name="confirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                    </div> 
                    <div style={{marginTop: 5}}>
                        <Field type="password" name="password" placeholder="Password" style={{height: 20, fontSize: 12}}/>
                        <ErrorMessage name="password" component="div" style={{color:"red", fontSize: 14}} />   
                    </div>
                    <div>
                        <Field type="password" name="confirmPassword" placeholder="Confirm Password" style={{height: 20, fontSize: 12}}/>
                        <ErrorMessage name="confirmPassword" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                </div>
            )
        }
    }

    handleSubmit = (values) => {
        if (this.state.registrationForm === 'open') {
            this.checkAvailability(values.phoneNumber);
        } else {
            this.confirmRegistration(values)
        }
    }

    render() {

        return (
            <div style={this.formStyle}>
                <Formik
                initialValues = {{phoneNumber: '', confirmationNumber: '', password: '', confirmPassword: ''}}
                validationSchema={this.registrationValidationSchema()}
                onSubmit = {(values) => this.handleSubmit(values)}
            >
            {(props) => (
                <Form>
                    {this.getFormFields(props.values)}
                    <div style={{margin: 15}}>
                        <button style={{marginRight: 4}} type="button" onClick={() => this.props.cancel()}>Cancel</button>
                        <button type="submit">{(this.state.confirmationForm === 'open') ? ("Register") : ("Next")}</button>
                    </div>
                </Form>
            )}
            </Formik>
            </div>
        )
    }

}

const mapDispatchToProps = function(dispatch) {
    return {
        loginUser: token => dispatch(loginUser({token: token}))
    }
}

export default connect(null, mapDispatchToProps)(RegistrationComponent);