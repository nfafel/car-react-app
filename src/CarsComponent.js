import React, {Component} from 'react';
import './App.css';
import { Formik, Form,} from 'formik';
import * as Yup from 'yup'
import RepairsByCarComponent from './RepairsByCarComponent'
import CarFormComponent from './CarFormComponent'
import { connect } from 'react-redux';
import {logoutUser} from './redux/actions';

const restQueryFunctions = require('./Rest/queryFuncForCarsComponent');
const graphQLQueryFunctions = require('./GraphQL/graphQLQueriesForCars');

class CarsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cars: null,
            shouldGetPostData: false,
            shouldGetPutData: false,
            carIdUpdate: null,
            repairsForCar: null,
            repairCarId: null,
            repairCarMake: null,
            repairCarModel: null,
            repairCarYear: null
        }
        this.queryFunctions = (this.props.queryType === "rest") ? restQueryFunctions : graphQLQueryFunctions;
    }

    async componentDidMount() {
        try {
            const cars = await this.queryFunctions.getCarsData(this.props.token);
            this.setState({ cars: cars })
        } catch(err) {
            if (err.statusCode === 401 || err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    callDeleteData = async(car) => {
        try {
            const deletedCarId = await this.queryFunctions.deleteData(car._id, this.props.token);
            const newCarsData = this.state.cars.filter(car => car._id !== deletedCarId);

            if (this.state.repairCarId === car._id) { //reset the repairs shown for the car if car is deleted
                this.setState({ 
                    repairsForCar: null,
                    cars: newCarsData
                });
            } else {
                this.setState({ cars: newCarsData });
            }

            if (this.props.subscribed) {
                this.queryFunctions.notifyCarChange("delete", car, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.statusCode === 401 || err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    getPutData(car, setValues) {
        setValues({
            make: car.make,
            model: car.model,
            year: car.year,
            rating: car.rating
        });
        this.setState({
            shouldGetPutData: true,
            carIdUpdate: car._id
        });
    }
  
    callPutData = async(carId, values) => {
        try {
            const updatedCar = await this.queryFunctions.putData(carId, values, this.props.token)
            const newCarsData = this.state.cars.map((car) => {
                if (car._id === updatedCar._id) {
                    return updatedCar;
                } else {
                    return car;
                }
            })

            this.setState({
                cars: newCarsData,
                shouldGetPutData: false,
                carIdUpdate: null
            })

            if (this.props.subscribed) {
                this.queryFunctions.notifyCarChange("update", values, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.statusCode === 401 || err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    getPostData(resetForm) {
        resetForm({
            make: "",
            model: "",
            year: "",
            rating: ""
        })
        this.setState({shouldGetPostData: true});
    }
  
    callPostData = async(values) => {
        try {
            const newCar = await this.queryFunctions.postData(values, this.props.token)
            var newCarsData = this.state.cars;
            newCarsData.push(newCar);

            this.setState({
                cars: newCarsData,
                shouldGetPostData: false,
            })

            if (this.props.subscribed) {
                this.queryFunctions.notifyCarChange("create", values, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.statusCode === 401 || err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    setRepairsForCar = async(car) => {
        try {
            const repairsForCar = await this.queryFunctions.getRepairsForCar(car._id, this.props.token)
            this.setState({
                repairsForCar: repairsForCar,
                repairCarId: car._id,
                repairCarMake: car.make,
                repairCarModel: car.model,
                repairCarYear: car.year
            })
        } catch(err) {
            if (err.statusCode === 401 || err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    showRepairsForCar = () => {
        if (this.state.repairsForCar != null) {
            return (<RepairsByCarComponent repairsForCar={this.state.repairsForCar} repairCarMake={this.state.repairCarMake} repairCarModel={this.state.repairCarModel} repairCarYear={this.state.repairCarYear} rowColStyles={this.rowColStyles} tableStyles={this.tableStyles} />);
        } else {
            return (<br></br>)
        }
    }

    getNewCarButton = (resetForm) => {
        if (!(this.state.shouldGetPutData || this.state.shouldGetPostData)) {
            return (<button type="button" style={{"marginBottom":"1em"}} onClick={() => this.getPostData(resetForm)}>NEW CAR</button>)
        }
    }
  
    tableStyles = {
        "width": "80%",
        "borderCollapse": "collapse",
        "border": "1px solid #dddddd",
        "margin": "1em auto"
     
    };

    rowColStyles = {
        "borderCollapse": "collapse",
        "border": "1px solid #dddddd"
    };
  
    getCarsDisplay = (setValues, values, submitForm, setFieldValue) => {
        var carsDisplay = this.state.cars.map((car) => {
            if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
                return (<CarFormComponent values={values} submitForm={submitForm} setFieldValue={setFieldValue} shouldGetPutData={this.state.shouldGetPutData} cancel={() => {this.setState({shouldGetPutData: false})}} buttonText={"UPDATE"} />);
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                return (
                <tr style={this.rowColStyles}>
                <td>{car.year}</td>
                <td>{car.make}</td>
                <td>{car.model}</td>
                <td> {car.rating} </td>
                <td></td>
                </tr>)
            } else {
                return (
                <tr style={this.rowColStyles} >
                    <td>{car.year}</td>
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td> {car.rating} </td>
                    <td>
                        <button type="button" style={{"marginBottom":"1em"}} onClick={() => this.getPutData(car, setValues)}>EDIT</button>
                        <button type="button" style={{"marginBottom":"1em"}} onClick={() => this.setRepairsForCar(car)} >SEE REPAIRS</button>
                        <button type="button" style={{"marginBottom":"1em"}} onClick={() => this.callDeleteData(car)}>DELETE</button> 
                    </td>
                </tr>)
            }
        });
        if (this.state.shouldGetPostData) {
            carsDisplay.push(<CarFormComponent values={values} submitForm={submitForm} setFieldValue={setFieldValue} cancel={() => {this.setState({shouldGetPostData: false})}} buttonText={"SUBMIT"} />);
        }
        return carsDisplay;
    }
  
    handleCorrectSumbit = (values) => {
        if (this.state.shouldGetPostData) {
            this.callPostData(values);
        } else {
            this.callPutData(this.state.carIdUpdate, values);
        }
    }
  
    CarValidationSchema = Yup.object().shape({
      make: Yup.string()
        .required('Required'),
      model: Yup.string()
        .required('Required'),
      year: Yup.number()
        .integer('Must be an Integer')
        .min(1885, "Too Old!")
        .typeError('Must Be a Number')
        .required('Required'),
      rating: Yup.number()
        .typeError('Must be a Number')
        .integer('Must be an Integer')
        .min(0, 'Rating must be 0-10')
        .max(10, 'Rating must be 0-10')
        .required('Required')
    })
  
    render() {
        if (this.state.cars == null) {
            return <h4>Loading...</h4>
        }
        
        return(
            <div>
                <Formik
                initialValues = {{make: '', model: '', year: '', rating: ''}}
                validationSchema={this.CarValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {({setValues, values, resetForm, submitForm, setFieldValue}) => (
                <Form>
                    <table style={this.tableStyles}>
                        <tr style={this.rowColStyles}>
                            <th>Year</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                        {this.getCarsDisplay(setValues, values, submitForm, setFieldValue)}
                    </table>
                    {this.getNewCarButton(resetForm)}
                </Form>
                )}
                </Formik>
                {this.showRepairsForCar()}
            </div>
      );
    }
}

const mapStateToProps = function(state) {
    return {
        token: state.token,
        queryType: state.queryType,
        subscribed: state.subscribed,
        phoneNumber: state.phoneNumber
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}

  
export default connect(mapStateToProps, mapDispatchToProps)(CarsComponent);
