import React, {Component} from 'react';
import './App.css';
import { Formik, Form,} from 'formik';
import * as Yup from 'yup'
import RepairsByCarComponent from './RepairsByCarComponent'
import CarFormComponent from './CarFormComponent'

const restQueryFunctions = require('./queryFuncForCarsComponent');
const graphQLQueryFunctions = require('./graphQLQueriesForCars');

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
        this.queryFunctions = (this.props.queryFuncType == "rest") ? restQueryFunctions : graphQLQueryFunctions;
    }

    componentDidMount() {
        this.queryFunctions.getCarsData()
            .then(res => this.setState({ cars: res }))
            .catch(err => console.log(err));
    }
  
    callDeleteData(carId) {
        this.queryFunctions.deleteData(carId)
            .then(res => this.setState({cars: res}))
            .catch(err => console.log(err));
        
        if (this.state.repairCarId === carId) {
            this.setState( {repairsForCar: null} );
        }
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
        this.queryFunctions.putData(carId, values)
            .then(res => this.setState({ 
                cars: res,
                shouldGetPutData: false,
                carIdUpdate: null
            }))
            .catch(err => console.log(err));
    }
  
    getPostData(resetForm) {
        this.setState({shouldGetPostData: true});
        resetForm({
            make: "",
            model: "",
            year: "",
            rating: ""
        })
    }
  
    callPostData(values) {
        this.queryFunctions.postData(values)
            .then(res => this.setState({ 
                cars: res,
                shouldGetPostData: false,
                carIdUpdate: null,
            }))
            .catch(err => alert(err));
    }

    setRepairsForCar = (repairCarId, repairCarMake, repairCarModel, repairCarYear) => {
        this.queryFunctions.getRepairsForCar(repairCarId)
            .then(res => this.setState({ 
                repairsForCar: res,
                repairCarId: repairCarId,
                repairCarMake: repairCarMake,
                repairCarModel: repairCarModel,
                repairCarYear: repairCarYear
            }))
            .catch(err => console.log(err));
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
            return (<button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(resetForm)}>NEW CAR</button>)
        }
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
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(car, setValues)}>EDIT</button>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.setRepairsForCar(car._id, car.make, car.model, car.year)} >SEE REPAIRS</button>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(car._id)}>DELETE</button> 
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
  
export default CarsComponent;
