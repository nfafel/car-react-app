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
        repairCarId: null,
        repairCarMake: null,
        repairCarModel: null,
        repairCarYear: null,
        yearsRange: null, 
        allMakes: null,
        allModels: null,
        newCarYear: null,
        newCarMake: null
      }
    }
    
    componentDidMount() {
        queryFunctions.getCarsData()
            .then(res => this.setState({ cars: res.cars }))
            .catch(err => console.log(err));

        queryFunctions.getAllCarYears()
            .then(res => this.setState({ yearsRange: res.Years }))
            .catch(err => alert(err));

    }
  
    callDeleteData(carId) {
        queryFunctions.deleteData(carId)
            .then(res => this.setState({cars: res.cars}))
            .catch(err => console.log(err));

        queryFunctions.deleteRepairsWithCar(carId)
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
        queryFunctions.putData(carId, values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
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
        queryFunctions.postData(values)
            .then(res => this.setState({ 
                cars: res.cars,
                shouldGetPostData: false,
                shouldGetPutData: false,
                carIdUpdate: null,
            }))
            .catch(err => console.log(err));
    }

    setRepairsForCar = (repairCarId, repairCarMake, repairCarModel, repairCarYear) => {
        queryFunctions.getRepairsForCar(repairCarId)
            .then(res => this.setState({ 
                repairsForCar: res.repairsForCar,
                repairCarId: repairCarId,
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

    getYearOptions = () => {
        if (this.state.yearsRange == null) {
            return <p>Loading . . .</p>
        }

        var allYears = [<option value="">Select a Year</option>];
        for (var i = this.state.yearsRange.max_year; i>=this.state.yearsRange.min_year; i--) {
            allYears.push(<option value={i}>{i}</option>);
        }
        return allYears;
    }

    getMakeOptions = (values, setFieldValue) => {
        if (values.year === "") {
            return [<option value="" selected>Select a Make</option>, <option value="">Select a Year to see Car Makes</option>]
        }

        if (this.state.newCarYear !== values.year) {
            if (!this.state.shouldGetPutData) {
                setFieldValue('make', "");
            }
            this.setState( {newCarYear: values.year} );
            queryFunctions.getAllCarMakes(values.year)
                .then(res => this.setState({ allMakes: res.Makes }))
                .catch(err => alert(err)); 
        }

        if (this.state.allMakes == null ) {
            return (<option value="">Loading...</option>)
        }

        var allMakes;
        allMakes = this.state.allMakes.map((make) => {
            return (<option value={make.make_id}>{make.make_display}</option>);
        })
        allMakes.splice(0,0, <option value="">Select a Make</option>);
        return allMakes;
    }

    getModelOptions = (values, setFieldValue) => {
        if (values.make === "") {
            return [<option value="">Select a Model</option>, <option value="">Select a Make to see Car Models</option>]
        }

        if (this.state.newCarMake !== values.make) {
            if (!this.state.shouldGetPutData) {
                setFieldValue('model', "");
            }
            this.setState( {newCarMake: values.make} );
            
            queryFunctions.getAllCarModels(values.make, values.year)
                .then(res => this.setState({ allModels: res.Models }))
                .catch(err => alert(err));
        
        }

        if (this.state.allModels == null ) {
            return (<option value="">Loading...</option>)
        }

        var allModels;
        allModels = this.state.allModels.map((model) => {
            return (<option value={model.model_name}>{model.model_name}</option>);
        })
        allModels.splice(0,0, <option value="">Select a Model</option>);
        return allModels;
    }
    
    carForm = (values, submitForm, setFieldValue) => {
        var actionButtons;
        if (this.state.shouldGetPutData) {
            actionButtons = (
                <td>
                    <button type="button" onClick={() => submitForm()}>UPDATE</button>
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
                    <Field component="select" name="year" placeHolder="Year" >
                        {this.getYearOptions()}
                    </Field>
                    <ErrorMessage name="year" />
                </td>
                <td>
                    <Field component="select" name="make" placeHolder="Make" >
                        {this.getMakeOptions(values, setFieldValue)}
                    </Field>
                    <ErrorMessage name="make" />
                </td>
                <td>
                    <Field component="select" name="model" placeHolder="Model" >
                        {this.getModelOptions(values, setFieldValue)}
                    </Field>
                    <ErrorMessage name="model" />
                </td>
                <td>
                    <Field type="text" name="rating" placeHolder="Rating" />
                    <ErrorMessage name="rating" />
                </td>
                {actionButtons}
            </tr>
        )
    }
  
    getCarsDisplay = (setValues, values, submitForm, setFieldValue) => {

        var carsDisplay;
        if (this.state.cars == null) {
            carsDisplay = <tr style={this.rowColStyles}>"Loading ..."</tr>;
        } else {
            carsDisplay = this.state.cars.map((car) => { 
            if (this.state.shouldGetPutData && car._id === this.state.carIdUpdate) {
                return (this.carForm(values, submitForm, setFieldValue));
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
            carsDisplay.push([this.carForm(values, submitForm, setFieldValue)]);
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