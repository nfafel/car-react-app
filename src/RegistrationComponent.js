import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'

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
                        .matches(/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/, 'Required Format: (XXX)-XXX-XXXX'),
                }) 
            )
        } 

        return (
            Yup.object().shape({
                phoneNumber: Yup.string()
                    .required('Required')
                    .matches(/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/, 'Required Format: (XXX)-XXX-XXXX'),
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
            this.sendConfirmation(parseInt(parsedNumber));
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
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/sendConfirmation/${parsedNumber}`, {
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

    confirmRegistration = (values) => {
        if (parseInt(values.confirmationNumber) === this.state.confirmationNumber) {
            fetch(`https://tranquil-caverns-41069.herokuapp.com/users`, {
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
            this.props.setUser({
                phoneNumber: this.state.phoneNumber,
                password: values.password,
                subscribed: false
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

    handleSubmit = (values) => {
        if (this.state.registrationForm === 'open') {
            this.checkAvailability(values.phoneNumber);
        } else {
            this.confirmRegistration(values)
        }
    }

    render() {
        var fields
        if (this.state.confirmationForm === 'open') {
            fields = (
                <div>
                    <div>
                        <Field type="tel" name="phoneNumber" placeholder="(XXX)-XXX-XXXX"/>
                        <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                    <div style={{marginTop: 15}}>
                        <Field type="numeric" name="confirmationNumber" placeholder="Confirmation Number"/>
                        <ErrorMessage name="confirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                    </div> 
                    <div style={{marginTop: 5}}>
                        <Field type="password" name="password" placeholder="Password"/>
                        <ErrorMessage name="password" component="div" style={{color:"red", fontSize: 14}} />   
                    </div>
                    <div>
                        <Field type="password" name="confirmPassword" placeholder="Confirm Password"/>
                        <ErrorMessage name="confirmPassword" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                </div>
            )
        } else {
            fields = (
                <div>
                    <Field type="tel" name="phoneNumber" placeholder="(XXX)-XXX-XXXX"/>
                    <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                </div>
            )
        }
        
        var properForm = (
            <Formik
                initialValues = {{phoneNumber: '', confirmationNumber: '', password: '', confirmPassword: ''}}
                validationSchema={this.registrationValidationSchema()}
                onSubmit = {(values) => this.handleSubmit(values)}
            >
            {(props) => (
                <Form>
                    <p>Enter your phone number below. <br/> It will act as your username:</p>
                    {fields}
                    <div style={{margin: 15}}>
                        <button style={{marginRight: 4}} type="button" onClick={() => this.props.cancel()}>Cancel</button>
                        <button type="submit">{(this.state.confirmationForm === 'open') ? ("Register") : ("Next")}</button>
                    </div>
                </Form>
            )}
            </Formik>
        )

        return (
            <div style={this.formStyle}>
                {properForm}
            </div>
        )
    }

}

export default RegistrationComponent;