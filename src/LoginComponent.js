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
            user: null,
            incorrectGuesses: 0
        }
    }

    checkIfRegistered = async(phoneNumber) => { 
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");

        var body;
        try{
            const userResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/1${parsedNumber}`)
            body = await userResponse.json();
        } catch(err) {
            console.log(err)
        }

        if(body.user == null) {
            alert("The phone number you entered is not a registered number. Please sign up for a new account.")
        } else {
            this.validateUsername(body.user);
        }
    }

    validateUsername = async(user) => {
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
        this.setState({
            usernameForm: "closed",
            passwordForm: "open",
            confirmationNumber: confirmationNumber,
            user: user
        })

        try{
            fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/sendConfirmation/${user.phoneNumber}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    confirmationNumber: confirmationNumber.toString()
                })
            });
        } catch(err) {
            console.log(err)
        }
    }

    attemptLogin = (values) => {
        var correctConfirmationNum = (values.enteredConfirmationNumber === this.state.confirmationNumber);
        var correctPassword = (values.password === this.state.user.password);
        if (correctConfirmationNum && correctPassword) {
            this.props.setUser(this.state.user)
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

    smsButtonStyle = {
        "border": "none", 
        "background":"none", 
        "color":"blue", 
        "outline":"none"
    }

    testtest = async(phoneNumber) => {
        var parsedNumber = phoneNumber.replace(/-|\(|\)/g, "");
        var body;
        try{
            const userResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/1${parsedNumber}`)
            body = await userResponse.json();
        } catch(err) {
            console.log(err)
        }
        this.props.setUser(body.user)
    }

    formStyle = { 
        "border": "solid", 
        "backgroundColor": "#cdf6f7", 
        "width": 400
    }

    render() {
        var LoginForm;
        if (this.state.usernameForm === "open") {
            LoginForm = (
                <Formik
                    initialValues = {{phoneNumber: ''}}
                    validationSchema={this.UsernameValidationSchema}
                    //onSubmit = {(values) => this.checkIfRegistered(values.phoneNumber)}
                    onSubmit = {(values) => this.testtest(values.phoneNumber)}
                >
                {(props) => (
                    <Form style={this.formStyle} >
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
                    <Form style={this.formStyle} >
                        <p>Enter Password and Confirmation Number:</p>
                        <div>
                            <Field type="password" name="password" placeholder="Password"/>
                            <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                        </div>
                        <div style={{marginTop: '5px'}}>
                            <Field type="number" name="enteredConfirmationNumber" placeholder="Confirmation Number"/>
                            <ErrorMessage name="enteredConfirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                        </div>
                        <div style={{"margin": 15}}>
                            <button type="button" style={{backgroundColor: '#d0d5db', margin: '5px'}} onClick={() => this.setState({passwordForm: "closed"})}>Close</button>
                            <button type="submit" style={{backgroundColor: '#d0d5db', margin: '5px'}}>Login</button>
                        </div>
                    </Form>
                )}
                </Formik>
            )
        } 

        return (
            <div>
                {LoginForm}
                <button type="button" style={this.smsButtonStyle} onClick={() => this.props.createAccount()}>Create an Account</button>
            </div>
        )
    }
}
  
export default CarsComponent;