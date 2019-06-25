import React, {Component} from 'react';
import './App.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup'

class RepairsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        cars: null,
        repairs: null,
        shouldGetPostData: false,
        shouldGetPutData: false,
        repairIdUpdate: null
      }
    }
    
    componentDidMount() {
        this.getCarsData()
            .then(res => this.setState({ cars: res.cars }))
            .catch(err => console.log(err));

        this.getRepairsData()
            .then(res => this.setState({ repairs: res.repairs }))
            .catch(err => console.log(err));   
    }
  
    // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
  
    getCarsData = async() => {
      const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body);
      }
      return body;
    };

    getRepairsData = async() => {
        const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/repairs');
        const body = await response.json();
    
        if (response.status !== 200) {
          throw Error(body) 
        }
        return body;
    };

    callDeleteData(repairId) {
        this.deleteData(repairId)
            .then(res => this.setState({repairs: res.repairs}))
            .catch(err => console.log(err));
    }
  
    deleteData = async(repairId) => {
      const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
        method: 'DELETE'
      });
      const body = await response.json();
  
      if (response.status !== 200) {
        throw Error(body) 
      }
      return body;
    }
  
    getPutData(repair, setValues) {
        this.setState({
            shouldGetPutData: true,
            repairIdUpdate: repair._id
        });
        setValues({
            carId: repair.carId,
            description: repair.description,
            estTime: repair.estTime,
            cost: repair.cost,
            progress: repair.progress,
            technician: repair.technician
        });
    }
  
    callPutData(repairId, values) {
        this.putData(repairId, values)
            .then(res => this.setState({ 
                repairs: res.repairs,
                shouldGetPostData: false,
                shouldGetPutData: false,
                repairIdUpdate: null
            }))
            .catch(err => alert(err));
    }
  
    putData = async(repairId, values) => {
        const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
            method: 'PUT',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                carId: values.carId,
                description: values.description,
                estTime: values.estTime,
                cost: values.cost,
                progress: values.progress,
                technician: values.technician
            })
        });
        const body = await response.json();
  
        if (response.status !== 200) {
            throw Error(body) 
        }
        return body;
    }
  
    getPostData(setValues) {
      this.setState({shouldGetPostData: true});
      setValues({
        carId: "",
        description: "",
        estTime: "",
        cost: "",
        progress: "",
        technician: ""
      })
    }
  
    callPostData(values) {
      this.postData(values)
        .then(res => this.setState({ 
            repairs: res.repairs,
            shouldGetPostData: false,
            shouldGetPutData: false,
            repairIdUpdate: null,
          }))
        .catch(err => console.log(err));
    }
  
    postData = async(values) => {
        const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/repairs', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            carId: values.carId,
            description: values.description,
            estTime: values.estTime,
            cost: values.cost,
            progress: values.progress,
            technician: values.technician
        })
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body) 
        }
        return body;
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

    carOptions = () => {
        var carOptions;
        if (this.state.cars == null) {
            carOptions = (<p>Loading...</p>);
        } else {
            carOptions = this.state.cars.map((car) => {
                return (
                    <option value={car._id}>
                        {car.year} {car.make} {car.model}
                    </option>
                )
            })
        }
        return carOptions;
    }
    
    updateRepairForm = (values) => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="carId" component="select" placeHolder="car">
                    {this.carOptions()}
                </Field>
                <ErrorMessage name="carId" />
            </td>
            <td>
                <Field type="text" name="description" />
                <ErrorMessage name="description" />
            </td>
            <td>
                <Field type="text" name="estTime" />
                <ErrorMessage name="estTime" />
            </td>
            <td>
                <Field type="text" name="cost" />
                <ErrorMessage name="cost" />
            </td>
            <td>
                <Field type="text" name="progress" />
                <ErrorMessage name="progress" />
            </td>
            <td>
                <Field type="text" name="technician" />
                <ErrorMessage name="technician" />
            </td>
            <td>
                <button type="button" onClick={() => this.callPutData(this.state.repairIdUpdate, values)}>UPDATE</button>
            </td>
        </tr>
      )
    }
  
    newRepairForm = () => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="carId" component="select" placeHolder="car">
                    {this.carOptions()}
                </Field>
                <ErrorMessage name="carId" />
            </td>
            <td>
                <Field type="text" name="description" placeHolder="Description" />
                <ErrorMessage name="description" />
            </td>
            <td>
                <Field type="text" name="estTime" placeHolder="Estimated Time" />
                <ErrorMessage name="estTime" />
            </td>
            <td>
                <Field type="text" name="cost" placeHolder="Cost" />
                <ErrorMessage name="cost" />
            </td>
            <td>
                <Field type="text" name="progress" placeHolder="Progress" />
                <ErrorMessage name="progress" />
            </td>
            <td>
                <Field type="text" name="technician" placeHolder="Technician" />
                <ErrorMessage name="technician" />
            </td>
            <td>
                <button type="button" onClick={()=>{this.setState({shouldGetPostData:false})}}>cancel</button>
                <button type="submit">SUMBIT</button>
            </td>
        </tr>
    )}

    getRepairedCar = async(carId) => {
        const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`);
        const body = await response.json();
        return body;
    }
  
    getRepairsDisplay = (setValues, values) => {
        var repairsDisplay;
        if (this.state.repairs == null) {
            repairsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
        } else {
            repairsDisplay = this.state.repairs.map((repair) => { 
            if (this.state.shouldGetPutData && repair._id === this.state.repairIdUpdate) {
                return (this.updateRepairForm(values));
            } else if (this.state.shouldGetPostData || this.state.shouldGetPutData) {
                var repairedCar = this.getRepairedCar(repair.carId);
                return (
                <tr style={this.rowColStyles()}>
                <td>{repairedCar} </td>
                <td>{repair.description}</td>
                <td>{repair.estTime}</td>
                <td>{repair.cost}</td>
                <td>{repair.progress}</td>
                <td>{repair.technician}</td>
                <td></td>
                </tr>)
            } else {
                var repairedCar = this.getRepairedCar(repair.carId);
                return (
                <tr style={this.rowColStyles()}>
                    <td>{repairedCar}</td>
                    <td>{repair.description}</td>
                    <td>{repair.estTime}</td>
                    <td>{repair.cost}</td>
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
        carId: Yup.string()
            .required('Required'),
        description: Yup.string()
            .required('Required'),
        estTime: Yup.number('Must be a number')
            .required('Required'),
        cost: Yup.number('Must be a number')
            .positive('Must be positive')
            .required('Required'),
        progress: Yup.string()
            .required('Required'),
        technician: Yup.string()
            .required('Required')
    })
  
    render() {
  
        return(
            <div>
                <Formik
                initialValues = {{carId: '', description: '', estTime: '', cost: '', progress: '', technician: ''}}
                validationSchema={this.RepairValidationSchema}
                onSubmit = {(values) => {
                    this.handleCorrectSumbit(values)
                }}
                >
                {({setValues, values}) => (
                <Form>
                    <table style={this.tableStyles()}>
                    <tr style={this.rowColStyles()}>
                        <th>Car</th>
                        <th>Decription</th>
                        <th>Estimated Time</th>
                        <th>Cost</th>
                        <th>Progress</th>
                        <th>Technician</th>
                        <th>Actions</th>
                    </tr>
                    {this.getRepairsDisplay(setValues, values)}
                    </table>
                    <button type="button" style={{"margin-bottom":"1em"}} onClick={() => this.getPostData(setValues)}>NEW REPAIR</button>
                </Form>
                )}
                </Formik>
            </div>
        );
    }
  }
  
  export default RepairsComponent;