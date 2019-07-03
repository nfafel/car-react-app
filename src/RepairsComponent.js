import React, {Component} from 'react';
import './App.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'

const queryFunctions = require('./queryFuncForRepairsComponent');

class RepairWithCar {
    constructor(car, repair) {
        this.car = car;
        this._id = repair._id;
        this.description = repair.description;
        this.cost = repair.cost;
        this.date = repair.date;
        this.progress = repair.progress;
        this.technician = repair.technician;
    }
}

class RepairsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        mergedRepairs: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        repairIdUpdate: null
      }
    }
    
    /*
    componentDidMount() {
         queryFunctions.getCarsData()
             .then(res => this.setState({ cars: res.cars }))
             .catch(err => console.log(err));

         queryFunctions.getRepairsData()
             .then(res => this.setState({ repairs: res.repairs }))
             .catch(err => console.log(err));  
    }
    */

    
    async componentDidMount() {
        try {
            const carsResponse = await queryFunctions.getCarsData();
            const cars = carsResponse.cars;

            const repairsResponse = await queryFunctions.getRepairsData();
            const repairs = repairsResponse.repairs;

            var mergedRepairData = [];
            for (var i=0; i< repairs.length; i++) {
                var carForRepair = this.getCarForRepair(cars, repairs[i].car_id);
                mergedRepairData.push(new RepairWithCar(carForRepair, repairs[i]))
            }
            this.setState({
                mergedRepairs: mergedRepairData, 
                cars:cars
            });

        } catch(e) {
            console.error(e);
        }
    }

    getCarForRepair = (allCars, carId) => {
        for (var i = 0; i<allCars.length; i++) {
            if (allCars[i]._id === carId) {
                return allCars[i];
            }
        }
    }
    
    callDeleteData(repairId) {
        queryFunctions.deleteData(repairId)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData
                });
            })
            .catch(err => console.log(err));
    }
  
    getPutData(repair, setValues) {
        this.setState({
            shouldGetPutData: true,
            repairIdUpdate: repair._id
        });
        setValues({
            car_id: repair.car._id,
            description: repair.description,
            date: repair.date,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
    }
  
    callPutData(repairId, values) {
        queryFunctions.putData(repairId, values)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData, 
                    shouldGetPutData: false,
                    repairIdUpdate: null
                });
            })
            .catch(err => alert(err));
    }
  
    getPostData(resetForm) {
      this.setState({shouldGetPostData: true});
      resetForm({
        car_id: "",
        description: "",
        date: "",
        cost: "",
        progress: "",
        technician: ""
      })
    }
  
    callPostData(values) {
        queryFunctions.postData(values)
            .then(res => {
                var mergedRepairData = [];
                for (var i=0; i< res.repairs.length; i++) {
                    var carForRepair = this.getCarForRepair(this.state.cars, res.repairs[i].car_id);
                    mergedRepairData.push(new RepairWithCar(carForRepair, res.repairs[i]))
                }
                this.setState({
                    mergedRepairs: mergedRepairData, 
                    shouldGetPostData: false
                });
            })
            .catch(err => console.log(err));
    }
  
    tableStyles() {
        return ({
            "width": "80%",
            "border-collapse": "collapse",
            "border": "1px solid #dddddd",
            "margin": "1em auto"
        });
    };
  
    rowColStyles() {
        return ({
            "border-collapse": "collapse",
            "border": "1px solid #dddddd"
        });
    };

    carOptions = (values) => {
        var carOptions;
        
            carOptions = this.state.cars.filter((car) => {
                if (this.state.shouldGetPutData && (car._id === values.car_id)) {
                    return false;
                } else {
                    return true;
                }
            }).map((car) => {
                return (
                    <option value={car._id} >
                        {car.year} {car.make} {car.model}
                    </option>
                )
            })
        
       
        if (this.state.shouldGetPutData) {
            //alert(this.state.cars + "  " + values.car_id);
            var carUpdated = this.getCarForRepair(this.state.cars, values.car_id);
            //alert(carUpdated);
            carOptions.splice(0,0, <option value={values.car_id}>{carUpdated.year} {carUpdated.make} {carUpdated.model}</option>);
        } else {
            carOptions.splice(0,0, <option value=''>Select a Car</option>);
        }
        return carOptions;
    }
    
    updateRepairForm = (values, submitForm) => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="car_id" component="select">
                    {this.carOptions(values)}
                </Field>
                <ErrorMessage name="car_id" />
            </td>
            <td>
                <Field type="date" name="date" value={values.date.split('T', 1)}/>
                <ErrorMessage name="date" />
            </td>
            <td>
                <Field type="text" name="description" />
                <ErrorMessage name="description" />
            </td>
            <td>
                <Field type="text" name="cost" />
                <ErrorMessage name="cost" />
            </td>
            <td>
                <Field name="progress" component="select" value={values.progress}>
                    <option value="Ready">Ready</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </Field>
                <ErrorMessage name="progress" />
            </td>
            <td>
                <Field type="text" name="technician" />
                <ErrorMessage name="technician" />
            </td>
            <td>
                <button type="button" onClick={()=>{this.setState({shouldGetPutData:false})}}>CANCEL</button>
                <button type="button" onClick={() => submitForm()}>UPDATE</button>
            </td>
        </tr>
      )
    }
  
    newRepairForm = () => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="car_id" component="select" placeHolder="car_id">
                    {this.carOptions()}
                </Field>
                <ErrorMessage name="car_id" />
            </td>
            <td>
                <Field type="date" name="date" placeHolder="Date" />
                <ErrorMessage name="date" />
            </td>
            <td>
                <Field type="text" name="description" placeHolder="Description" />
                <ErrorMessage name="description" />
            </td>
            <td>
                <Field type="text" name="cost" placeHolder="Cost (in Dollars)" />
                <ErrorMessage name="cost" />
            </td>
            <td>
                <Field name="progress" placeHolder="Progress" component="select" >
                    <option value="">Select Progress</option>
                    <option value="Ready">Ready</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </Field>
                <ErrorMessage name="progress" />
            </td>
            <td>
                <Field type="text" name="technician" placeHolder="Technician" />
                <ErrorMessage name="technician" />
            </td>
            <td>
                <button type="button" onClick={()=>{this.setState({shouldGetPostData:false})}}>CANCEL</button>
                <button type="submit">SUMBIT</button>
            </td>
        </tr>
    )}

    getRepairsDisplay = (setValues, values, submitForm) => {
        var repairsDisplay = this.state.mergedRepairs.map((repair) => { 
            if (this.state.shouldGetPutData && repair._id === this.state.repairIdUpdate) {
                return (this.updateRepairForm(values, submitForm));
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                return (
                <tr style={this.rowColStyles()}>
                <td>{repair.car.year} {repair.car.make} {repair.car.model}</td>
                <td>{repair.date.split('T', 1)}</td>
                <td>{repair.description}</td>
                <td>${repair.cost}</td>
                <td>{repair.progress}</td>
                <td>{repair.technician}</td>
                <td></td>
                </tr>)
            } else {
                return (
                <tr style={this.rowColStyles()}>
                    <td>{repair.car.year} {repair.car.make} {repair.car.model}</td>
                    <td>{repair.date.split('T', 1)}</td>
                    <td>{repair.description}</td>
                    <td>${repair.cost}</td>
                    <td>{repair.progress}</td>
                    <td>{repair.technician}</td>
                    <td>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPutData(repair, setValues)}>EDIT</button>
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(repair._id)}>DELETE</button> 
                    </td>
                </tr>)
            }
        });
        if (this.state.shouldGetPostData) {
            repairsDisplay.push([this.newRepairForm()]);
        }
        return repairsDisplay;
    }
  
    handleCorrectSumbit = (values) => {
      if (this.state.shouldGetPostData) {
        this.callPostData(values);
      } else {
        this.callPutData(this.state.repairIdUpdate, values);
      }
    }
  
    RepairValidationSchema = Yup.object().shape({
        car_id: Yup.string()
            .required('Required'),
        description: Yup.string()
            .required('Required'),
        date: Yup.date()
            .typeError('Must be a Date')
            .required('Required'),
        cost: Yup.number()
            .typeError('Must be a Number')
            .positive('Must be positive')
            .required('Required'),
        progress: Yup.string()
            .required('Required'),
        technician: Yup.string()
            .required('Required')
    })

    getNewRepairButton = (resetForm) => {
        if (!(this.state.shouldGetPostData || this.state.shouldGetPutData)) {
            return (<button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(resetForm)}>NEW REPAIR</button>)
        }
    }
  
    render() {
        if (this.state.cars == null || this.state.mergedRepairs == null) {
            return <h4>Loading...</h4>
        }
  
        return(
            <div>
                <Formik
                initialValues = {{car_id: '', description: '', date: '', cost: '', progress: '', technician: ''}}
                validationSchema={this.RepairValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {({setValues, values, resetForm, submitForm}) => (
                <Form>
                    <table style={this.tableStyles()}>
                    <tr style={this.rowColStyles()}>
                        <th>Car</th>
                        <th>Date Admitted</th>
                        <th>Decription</th>
                        <th>Cost</th>
                        <th>Progress</th>
                        <th>Technician</th>
                        <th>Actions</th>
                    </tr>
                    {this.getRepairsDisplay(setValues, values, submitForm)}
                    </table>
                    {this.getNewRepairButton(resetForm)}
                </Form>
                )}
                </Formik>
            </div>
        );
    }
  }
  
  export default RepairsComponent;