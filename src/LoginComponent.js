import React, {Component} from 'react';
import './App.css';
import { Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {loginUser} from './redux/actions';
import { connect } from 'react-redux';
import { prepareLogin, login } from './Rest/restLoginFunc'
import { prepareGraphQLLogin, graphQLLogin } from './GraphQL/graphQLLoginFunc'
const jwt = require('jsonwebtoken');

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

    loginValidationSchema = () => {
        if (this.state.loginForm === "open") {
            return (
                Yup.object().shape({
                    phoneNumber: Yup.string()
                        .required('Required')
                        .matches(/^\(?[0-9]{3}\)?-?[0-9]{3}-?[0-9]{4}$/, 'Please enter a valid phone number'),
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
        if (values.queryType === "rest") {
            if (this.state.loginForm === "open") {
                prepareLogin(values, this)
            } else {
                login(values, this)
            }
        } else {
            if (this.state.loginForm === "open") {
                prepareGraphQLLogin(values, this)
            } else {
                graphQLLogin(values, this)
            }
        }
        
    }

    render() {

        return (
            <div>
                <Formik
                    initialValues = {{phoneNumber: '', password: '', queryType: 'rest', confirmationNumber: ''}}
                    validationSchema={this.loginValidationSchema()}
                    onSubmit = {(values) => this.handleSubmit(values)}
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
        loginUser: (token, queryType) => {
            const decoded = jwt.decode(token);
            dispatch( loginUser({
                token: token, 
                subscribed: decoded.payload.subscribed,
                phoneNumber: decoded.payload.phoneNumber,
                queryType: queryType
            }))
        },
    }
}
  
export default connect(null, mapDispatchToProps)(LoginComponent);