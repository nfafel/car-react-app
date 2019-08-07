import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'

class CarsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            usernameForm: "open",
            passwordForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            incorrectGuesses: 0
        }
    }

    checkIfRegistered = (phoneNumber) => { //async await
        //check if the phone number given is in the database
        this.validateUsername(phoneNumber);
    }

    validateUsername = async(phoneNumber) => {
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;

        const user = await fetch(`https://tranquil-caverns-41069.herokuapp.com/user/password/1${parsedNumber}`)
        this.setState({
            phoneNumber: parsedNumber,
            usernameForm: "closed",
            passwordForm: "open",
            confirmationNumber: confirmationNumber,
            password: user.password
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

    attemptLogin = (values) => {
        var correctConfirmationNum = (values.enteredConfirmationNumber === this.state.confirmationNumber);
        var correctPassword = (values.password === this.state.password);
        if (correctConfirmationNum && correctPassword) {
            this.props.setUser(this.state.phoneNumber)
        } else {
            if (this.state.incorrectGuesses < 2) {
                alert("The confirmation number or password you provided is incorrect. Please try again.")
                this.setState({
                    incorrectGuesses: this.state.incorrectGuesses+1
                })
            } else {
                alert("You have attempted to login too many times. Please restart.")
                this.setState({
                    incorrectGuesses: 0,
                    SMSConfirmationForm: "closed"
                })
            }
        }
    }

    UsernameValidationSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .required('Required')
            .matches(/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/, 'Required Format: (XXX)-XXX-XXXX')
    })

    PasswordValidationSchema = Yup.object().shape({
        enteredConfirmationNumber: Yup.number()
            .required('Required')
            .typeError('Must Enter a Number'),
        password: Yup.string()
            .required('Required')
    })

    render() {
        var LoginForm;
        if (this.state.usernameForm === "open") {
            LoginForm = (
                <Formik
                    initialValues = {{phoneNumber: ''}}
                    validationSchema={this.UsernameValidationSchema}
                    onSubmit = {(values) => this.checkIfRegistered(values.phoneNumber)}
                >
                {(props) => (
                    <Form style={{border: '0.2vh solid grey', width: "400px"}} >
                        <p>Login</p>
                        <Field type="tel" name="phoneNumber" placeholder="Phone Number"/>
                        <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                        <div style={{"margin": 15}}>
                            <button style={{backgroundColor: '#d0d5db'}} type="submit">Next</button>
                        </div>
                    </Form>
                )}
                </Formik>
            )
        } else {
            LoginForm = (
                <Formik
                    initialValues = {{confirmationNumber: '', password: ''}}
                    validationSchema={this.PasswordValidationSchema}
                    onSubmit = {(values) => this.attemptLogin(values)}
                >
                {(props) => (
                    <Form style={{border: '0.2vh solid grey', width: "400px"}} >
                        <p>Enter Password and Confirmation Number:</p>
                        <div>
                            <Field type="text" name="password" placeholder="Password"/>
                            <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <Field type="number" name="enteredConfirmationNumber" placeholder="Confirmation Number"/>
                            <ErrorMessage name="enteredConfirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                        </div>
                        <div style={{"margin": 15}}>
                            <button type="button" style={{backgroundColor: '#d0d5db', margin: '5px'}} onClick={() => this.setState({SMSSubscriptionForm: "closed"})}>Close</button>
                            <button type="submit" style={{backgroundColor: '#d0d5db', margin: '5px'}}>Login</button>
                        </div>
                    </Form>
                )}
                </Formik>
            )
        } 

        return (
            <div style={{height: '70vh', width: '100vw', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                {LoginForm}
            </div>
        )
    }
}
  
export default CarsComponent;