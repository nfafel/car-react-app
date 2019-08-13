import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {loginUser, setQueryType} from './redux/actions';
import { connect } from 'react-redux';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            token: null,
            incorrectGuesses: 0
        }
    }

    prepareLogin = async(values) => { 
        var parsedNumber = `1${values.phoneNumber.replace(/-|\(|\)/g, "")}`;
        
        try{
            const userResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/login`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: parsedNumber,
                    password: values.password
                })
            })
            const body = await userResponse.json();
            if(body.message) {
                alert(body.message)
            } else {
                this.confirmLogin(parsedNumber, body.token);
            }

        } catch(err) {
            console.log(err)
        }
    }

    confirmLogin = async(parsedNumber, token) => {
        var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
        try{
            fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${parsedNumber}/sendConfirmation`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    confirmationNumber: confirmationNumber.toString()
                })
            });
            this.setState({
                phoneNumber: parsedNumber,
                token: token,
                confirmationNumber: confirmationNumber,
                loginForm: 'closed',
                confimationForm: 'open'
            })
        } catch(err) {
            console.log(err)
        }
    }

    login = async(values) => {
        if (values.confirmationNumber === this.state.confirmationNumber) {
            try {    
                this.props.loginUser(this.state.token)
            } catch(err) {
                console.log(err)
            }

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
                    passwordForm: "closed",
                    confirmationNumber: null
                })
            }
        }
    }

    loginValidationSchema = () => {
        if (this.state.loginForm === "open") {
            return (
                Yup.object().shape({
                    phoneNumber: Yup.string()
                        .required('Required')
                        .matches(/^\([0-9]{3}\)-[0-9]{3}-[0-9]{4}$/, 'Required Format: (XXX)-XXX-XXXX'),
                    password: Yup.string()
                        .required('Required'),
                    queryType: Yup.string()
                        .required("Required"),
                })
            )
        } else {
            return (
                Yup.object().shape({
                    confirmationNumber: Yup.number()
                        .required("Requried")
                        .typeError('Must Enter a Number')
                })
            )
        }
    }

    registerButtonStyle = {
        "border": "none", 
        "background":"none", 
        "color":"blue", 
        "outline":"none",
        "fontSize": 13
    }

    formStyle = { 
        "border": "solid", 
        "backgroundColor": "#cdf6f7", 
        "width": 500
    }

    testtest = async(values) => {
        var parsedNumber = `1${values.phoneNumber.replace(/-|\(|\)/g, "")}`;

        try{
            const userResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/login`, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phoneNumber: parsedNumber,
                    password: values.password
                })
            })
            const body = await userResponse.json();

            if(body.message) {
                alert(body.message)
            } else {
                this.props.setQueryType(values.queryType)
                this.props.loginUser(body.token)
            }

        } catch(err) {
            alert(err)
        }
    }

    resetLogin = async(resetForm) => {
        resetForm();
        this.setState({
            loginForm: "open",
            confirmationForm: "closed",
            confirmationNumber: null,
            phoneNumber: null,
            token: null,
            incorrectGuesses: 0
        });
    }

    getLoginForm = (values, resetForm) => {
        var loginForm;
        if (this.state.loginForm === "open") {
            loginForm = (
                <Form style={this.formStyle} >
                    <p style={{fontSize: 25, margin: 12}}>Login</p>
                    <div style={{margin:15}}>
                        <Field type="tel" name="phoneNumber" placeholder="Phone Number" style={{height: 20, fontSize: 12}}/>
                        <ErrorMessage name="phoneNumber" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                    <div style={{margin:15}}>
                        <Field type="password" name="password" placeholder="Password" style={{height: 20, fontSize: 12}}/>
                        <ErrorMessage name="password" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                    <div style={{marginTop: 10}}>
                        <Field type="radio" name="queryType" value="rest" checked={values.queryType === "rest"} /> Rest <span style={{marginLeft:"0.5em"}} />
                        <Field type="radio" name="queryType" value="graphql" /> GraphQL
                    </div>
                    <div style={{"margin": 15}}>
                        <button style={{backgroundColor: '#d4d2d2', height: 25, width: 60, fontSize: 15, borderRadius: 6}} type="submit">Next</button>
                    </div>
                </Form>   
            )
        } else {
            loginForm = (
                <Form style={this.formStyle} >
                    <div style={{marginTop: 15}}>
                        <input value={values.phoneNumber} readOnly style={{height: 20, fontSize: 12}} />
                    </div>
                    <div style={{marginTop: 15}}>
                        <input type="password" value={values.password} readOnly style={{height: 20, fontSize: 12}} />
                    </div>
                    <p>Confirmation Number:</p>
                    <div style={{marginTop: 10}}>
                        <Field type="number" name="confirmationNumber" placeholder="Confirmation Number" style={{height: 20, fontSize: 12}} />
                        <ErrorMessage name="confirmationNumber" component="div" style={{color:"red", fontSize: 14}} />
                    </div>
                    <div style={{"margin": 15}}>
                        <button type="button" style={{backgroundColor: '#d0d5db', margin: '5px'}} onClick={() => this.resetLogin(resetForm)}>Close</button>
                        <button type="submit" style={{backgroundColor: '#d0d5db', margin: '5px'}}>Login</button>
                    </div>
                </Form>
            )
        } 
        return loginForm;
    }

    handleSubmit = (values) => {
        if (this.state.loginForm === "open") {
            this.prepareLogin(values)
        } else {
            this.login(values)
        }
    }

    render() {

        return (
            <div>
                <Formik
                    initialValues = {{phoneNumber: '', password: '', queryType: 'rest', confirmationNumber: null}}
                    validationSchema={this.loginValidationSchema()}
                    //onSubmit = {(values) => this.handleSubmit(values)}
                    onSubmit = {(values) => this.testtest(values)}
                >
                    {(props) => 
                        this.getLoginForm(props.values, props.resetForm)
                    }
                </Formik>
                <button type="button" style={this.registerButtonStyle} onClick={() => this.props.createAccount()}>Create an Account</button>
            </div>
        )
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        loginUser: token => dispatch(loginUser({token: token})),
        setQueryType: queryType => dispatch(setQueryType({queryType: queryType}))
    }
}
  
export default connect(null, mapDispatchToProps)(LoginComponent);