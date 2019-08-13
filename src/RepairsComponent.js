import React, {Component} from 'react';
import './App.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {logoutUser} from './redux/actions';

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
        repairUpdated: null
      }
    }
    
    async componentDidMount() {
        try {
            const cars = await queryFunctions.getCarsData(this.props.token);
            const repairs = await queryFunctions.getRepairsData(this.props.token);

            var mergedRepairData = [];
            for (var i=0; i< repairs.length; i++) {
                var carForRepair = this.getCarForRepair(repairs[i].car_id, cars);
                mergedRepairData.push(new RepairWithCar(carForRepair, repairs[i]))
            }

            this.setState({
                mergedRepairs: mergedRepairData, 
                cars:cars
            });

        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }

    getCarForRepair = (carId, allCars) => {
        for (var i = 0; i<allCars.length; i++) {
            if (allCars[i]._id === carId) {
                return allCars[i];
            }
        }
    }
    
    callDeleteData = async(repair) => {
        try {
            const deletedRepairId = await queryFunctions.deleteData(repair._id, this.props.token);
            const newMergedRepairs = this.state.mergedRepairs.filter(repair => repair._id !== deletedRepairId);

            this.setState({ mergedRepairs: newMergedRepairs});

            // if (this.props.user.subscribed) {
            //     var car = this.getCarForRepair(repair.car._id, this.state.cars);
            //     queryFunctions.notifyRepairChange("delete", repair, car, this.props.user.phoneNumber)
            // }

        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }   
    }
  
    getPutData(repair, setValues) {
        setValues({
            car_id: repair.car._id,
            description: repair.description,
            date: repair.date,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
        this.setState({
            shouldGetPutData: true,
            repairUpdated: repair
        });
    }
  
    callPutData = async(repair, values) => {
        try {
            const updatedRepair = await queryFunctions.putData(repair._id, values, this.props.token);
            const carForRepair = this.getCarForRepair(updatedRepair.car_id, this.state.cars)
            const mergedRepair = new RepairWithCar(carForRepair, updatedRepair);
            
            const newMergedRepairs = this.state.mergedRepairs.map((repair) => {
                if (repair._id === updatedRepair._id) {
                    return mergedRepair;
                } else {
                    return repair;
                }
            })
            this.setState({
                mergedRepairs: newMergedRepairs, 
                shouldGetPutData: false,
                repairUpdated: null
            });

            // if (this.props.user.subscribed) {
            //     var car = this.getCarForRepair(values.car_id, this.state.cars);
            //     queryFunctions.notifyRepairChange("update", values, car, this.props.user.phoneNumber)
            // }
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
    }
  
    getPostData(resetForm) {
        resetForm({
            car_id: "",
            description: "",
            date: "",
            cost: "",
            progress: "",
            technician: ""
        })
        this.setState({shouldGetPostData: true});
    }
  
    callPostData = async(values) => {
        try {
            const newRepair = await queryFunctions.postData(values, this.props.token);
            const carForRepair = this.getCarForRepair(newRepair.car_id, this.state.cars)
            const mergedRepair = new RepairWithCar(carForRepair, newRepair);
            
            const newMergedRepairs = this.state.mergedRepairs;
            newMergedRepairs.push(mergedRepair);

            this.setState({
                mergedRepairs: newMergedRepairs, 
                shouldGetPostData: false
            });

            // if (this.props.user.subscribed) {
            //     var car = this.getCarForRepair(values.car_id, this.state.cars);
            //     queryFunctions.notifyRepairChange("create", values, car, this.props.user.phoneNumber)
            // }
        } catch(err) {
            if (err.statusCode === 401) {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message)
        }
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
            if (this.state.shouldGetPutData && repair._id === this.state.repairUpdated._id) {
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
                        <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.callDeleteData(repair)}>DELETE</button> 
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
        this.callPutData(this.state.repairUpdated, values);
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
  
const mapStateToProps = function(state) {
    return {
        token: state.token
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RepairsComponent);