import React, {Component} from 'react';
import './App.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'
import RepairsByCarComponent from './RepairsByCarComponent'

const queryFunctions = require('./queryFuncForCarsComponent')

class CarsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        carIdUpdate: null,
        repairsForCar: null,
        repairCarMake: null,
        repairCarModel: null,
        repairCarYear: null
      }
    }
    
    componentDidMount() {
      queryFunctions.getCarsData()
        .then(res => this.setState({ cars: res.cars }))
        .catch(err => console.log(err));
    }
  
    callDeleteData(carId) {
        queryFunctions.deleteData(carId)
            .then(res => this.setState({cars: res.cars}))
            .catch(err => console.log(err));
    }
  
    getPutData(car, setValues) {
      this.setState({
        shouldGetPutData: true,
        carIdUpdate: car._id
      });
      setValues({
        make: car.make,
        model: car.model,
        year: car.year,
        rating: car.rating
      });
    }
  
    callPutData(carId, values) {
        queryFunctions.putData(carId, values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
                shouldGetPutData: false,
                carIdUpdate: null
                }))
            .catch(err => console.log(err));
    }
  
  
    getPostData(setValues) {
        this.setState({shouldGetPostData: true});
        setValues({
            make: "",
            model: "",
            year: "",
            rating: ""
        })
    }
  
    callPostData(values) {
        queryFunctions.postData(values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
                shouldGetPutData: false,
                carIdUpdate: null,
            }))
            .catch(err => console.log(err));
    }

    setRepairsForCar = (repairsForCarId, repairCarMake, repairCarModel, repairCarYear) => {
        queryFunctions.getRepairsForCar(repairsForCarId)
            .then(res => this.setState({ 
                repairsForCar: res.repairsForCar,
                repairCarMake: repairCarMake,
                repairCarModel: repairCarModel,
                repairCarYear: repairCarYear
            }))
            .catch(err => console.log(err));
    }
  
    tableStyles = {
        "width": "80%",
        "border-collapse": "collapse",
        "border": "1px solid #dddddd",
        "margin": "1em auto"
     
    };

    rowColStyles = {
        "border-collapse": "collapse",
        "border": "1px solid #dddddd"
     
    };
    
    carForm = (values) => {
        var actionButtons;
        if (this.state.shouldGetPutData) {
            actionButtons = (
                <td>
                    <button type="button" onClick={() => this.callPutData(this.state.carIdUpdate, values)}>UPDATE</button>
                </td>
            )
        } else {
            actionButtons = (
                <td>
                    <button type="button" onClick={()=>{this.setState({shouldGetPostData:false})}}>cancel</button>
                    <button type="submit">SUMBIT</button>
                </td>
            )
        }

        return (
            <tr style={this.rowColStyles}>
                <td>
                    <Field type="text" name="make" placeHolder="Make" />
                    <ErrorMessage name="make" />
                </td>
                <td>
                    <Field type="text" name="model" placeHolder="Model" />
                    <ErrorMessage name="model" />
                </td>
                <td>
                    <Field type="text" name="year" placeHolder="Year" />
                    <ErrorMessage name="year" />
                </td>
                <td>
                    <Field type="text" name="rating" placeHolder="Rating" />
                    <ErrorMessage name="rating" />
                </td>
                {actionButtons}
            </tr>
        )
    }
  
    getCarsDisplay = (setValues, values) => {

        var carsDisplay;
        if (this.state.cars == null) {
            carsDisplay = <tr style={this.rowColStyles}>"Loading ..."</tr>;
        } else {
            carsDisplay = this.state.cars.map((car) => { 
            if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
                return (this.carForm(values));
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                return (
                <tr style={this.rowColStyles}>
                <td>{car.make}</td>
                <td>{car.model}</td>
                <td>{car.year}</td>
                <td> {car.rating} </td>
                <td></td>
                </tr>)
            } else {
                return (
                <tr style={this.rowColStyles} >
                    <td>{car.make}</td>
                    <td>{car.model}</td>
                    <td>{car.year}</td>
                    <td> {car.rating} </td>
                    <td>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(car, setValues)}>EDIT</button>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.setRepairsForCar(car._id, car.make, car.model, car.year)} >SEE REPAIRS</button>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(car._id)}>DELETE</button> 
                    </td>
                </tr>)
            }
            });
            if (this.state.shouldGetPostData) {
            carsDisplay.push([this.carForm()]);
            }
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
      year: Yup.number('Must be a number')
        .integer('Must be an Integer')
        .min(1885, "Too Old!")
        .required('Required'),
      rating: Yup.number('Must be a number')
        .positive('Must be positive')
        .integer('Must be an Integer')
        .min(0, 'Rating must be 0-10')
        .max(10, 'Rating must be 0-10')
        .required('Required')
    })

    showRepairsForCar = () => {
        if (this.state.repairsForCar != null) {
            return (<RepairsByCarComponent repairsForCar={this.state.repairsForCar} repairCarMake={this.state.repairCarMake} repairCarModel={this.state.repairCarModel} repairCarYear={this.state.repairCarYear} rowColStyles={this.rowColStyles} tableStyles={this.tableStyles} />);
        } else {
            return (<br></br>)
        }
    }
  
    render() {

        return(
            <div>
                <Formik
                initialValues = {{make: '', model: '', year: '', rating: ''}}
                validationSchema={this.CarValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {({setValues, values}) => (
                <Form>
                    <table style={this.tableStyles}>
                    <tr style={this.rowColStyles}>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                    {this.getCarsDisplay(setValues, values)}
                    </table>
                    <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(setValues)}>NEW CAR</button>                </Form>
                )}
                </Formik>
                {this.showRepairsForCar()}
            </div>
      );
    }
  }
  
  export default CarsComponent;