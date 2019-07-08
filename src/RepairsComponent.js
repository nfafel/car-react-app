import React, {Component} from 'react';
import './App.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import RepairFormComponent from './RepairFormComponent'

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

    getRepairsDisplay = (setValues, values) => {
        var repairsDisplay = this.state.mergedRepairs.map((repair) => { 
            if (this.state.shouldGetPutData && repair._id === this.state.repairIdUpdate) {
                return (<RepairFormComponent cars={this.state.cars} values={values} formType={"update"} cancel={() => this.setState({shouldGetPutData: false})} /> );
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
            repairsDisplay.push(<RepairFormComponent cars={this.state.cars} values={values} formType={"new"} cancel={() => this.setState({shouldGetPostData: false})} />);
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
                {({setValues, values, resetForm}) => (
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
                    {this.getRepairsDisplay(setValues, values)}
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