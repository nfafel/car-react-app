import React, {Component} from 'react';
import './App.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import RepairFormComponent from './RepairFormComponent'

const queryFunctions = require('./graphQLQueriesForRepairs');
const queryFunctionsForCars = require('./graphQLQueriesForCars');

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
    
    componentDidMount() {
        queryFunctions.getRepairsData()
            .then(res => this.setState({mergedRepairs: res }))
            .catch(err => console.log(err))
    }
    
    callDeleteData(repairId) {
        queryFunctions.deleteData(repairId)
            .then(res => this.setState({mergedRepairs: res}))
            .catch(err => console.log(err));
    }
  
    getPutData(repair, setValues) {
        queryFunctionsForCars.getCarsData()
            .then(res => this.setState({
                cars: res,
                shouldGetPutData: true,
                repairIdUpdate: repair._id
            }))
            .catch(err => console.log(err))
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
            .then(res => this.setState({
                mergedRepairs: res, 
                shouldGetPutData: false,
                repairIdUpdate: null
            }))
            .catch(err => alert(err));
    }
  
    getPostData(resetForm) {
        queryFunctionsForCars.getCarsData()
            .then(res => this.setState({
                cars: res,
                shouldGetPostData: true
            }))
            .catch(err => console.log(err))
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
            .then(res => this.setState({
                mergedRepairs: res, 
                shouldGetPostData: false
            }))
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
        if (this.state.mergedRepairs == null) {
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