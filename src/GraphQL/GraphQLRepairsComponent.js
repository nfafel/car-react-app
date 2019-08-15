import React, {Component} from 'react';
import '../App.css';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { connect } from 'react-redux';
import {logoutUser} from '../redux/actions';
import RepairFormComponent from '../RepairFormComponent'

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
        repairUpdated: null
      }
    }
    
    async componentDidMount() {
        try{
            const repairs = await queryFunctions.getRepairsData(this.props.token);
            const cars = await queryFunctionsForCars.getCarsData(this.props.token);
            this.setState({ 
                mergedRepairs: repairs,
                cars: cars
            })
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }
    
    callDeleteData = async(repair) => {
        try {
            const deletedId = await queryFunctions.deleteData(repair._id, this.props.token);
            const newRepairs = this.state.mergedRepairs.filter(repair => repair._id !== deletedId);
            this.setState({mergedRepairs: newRepairs});

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", repair, repair.car, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
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
  
    callPutData = async(repairId, values) => {
        try {
            const updatedRepair = await queryFunctions.putData(repairId, values, this.props.token);
            const newRepairs = this.state.mergedRepairs.map((repair) => {
                if (repair._id === updatedRepair._id) {
                    return updatedRepair;
                }
                return repair;
            })
            this.setState({
                mergedRepairs: newRepairs, 
                shouldGetPutData: false,
                repairUpdated: null
            })

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", updatedRepair, updatedRepair.car, this.props.phoneNumber)
            }

        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
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
            const newRepairs = this.state.mergedRepairs;
            newRepairs.push(newRepair);
            this.setState({
                mergedRepairs: newRepairs, 
                shouldGetPostData: false
            })

            if (this.props.subscribed) {
                queryFunctions.notifyRepairChange("delete", newRepair, newRepair.car, this.props.phoneNumber)
            }
        } catch(err) {
            if (err.message === "GraphQL error: Unauthorized") {
                this.props.logoutUser();
                setTimeout(() => alert("You have been automatically logged out. Please login in again."))
            }
            console.log(err.message);
        }
    }
  
    tableStyles() {
        return ({
            "width": "80%",
            "borderCollapse": "collapse",
            "border": "1px solid #dddddd",
            "margin": "1em auto"
        });
    };
  
    rowColStyles() {
        return ({
            "borderCollapse": "collapse",
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
                        <button type="button" style={{"marginBottom":"1em"}} onClick={() => this.getPutData(repair, setValues)}>EDIT</button>
                        <button type="button" style={{"marginBottom":"1em"}} onClick={() => this.callDeleteData(repair)}>DELETE</button> 
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
        this.callPutData(this.state.repairUpdated._id, values);
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
            return (<button type="button" style={{"marginBottom":"1em"}} onClick={() => this.getPostData(resetForm)}>NEW REPAIR</button>)
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

const mapStateToProps = function(state) {
    return {
        token: state.token,
        subscribed: state.subscribed,
        phoneNumber: state.phoneNumber
    }
}
const mapDispatchToProps = function(dispatch) {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(RepairsComponent);