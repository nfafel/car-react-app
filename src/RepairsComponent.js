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
            car: JSON.stringify(repair.car),
            description: repair.description,
            date: repair.date,
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
                car: JSON.parse(values.car),
                description: values.description,
                date: values.date,
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
        car: "",
        description: "",
        date: "",
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
            car: JSON.parse(values.car),
            description: values.description,
            date: values.date,
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

    carOptions = (values) => {
        var carOptions;
        if (this.state.cars == null) {
            carOptions = (<p>Loading...</p>);
        } else {
            carOptions = this.state.cars.filter((car) => {
                if (this.state.shouldGetPutData && (JSON.stringify(car) === values.car)) {
                    return false;
                } else {
                    return true;
                }
            }).map((car) => {
                return (
                    <option value={JSON.stringify(car)} >
                        {car.year} {car.make} {car.model}
                    </option>
                )
            })
        }
       
        if (this.state.shouldGetPutData) {
            var chosenCar = JSON.parse(values.car);
            var chosenCarMake = chosenCar.make;
            var chosenCarModel = chosenCar.model;
            var chosenCarYear = chosenCar.year;
            carOptions.splice(0,0, <option value={values.car}>{chosenCarYear} {chosenCarMake} {chosenCarModel}</option>);
        } else {
            carOptions.splice(0,0, <option value=''>Select a Car</option>);
        }
        return carOptions;
    }
    
    updateRepairForm = (values) => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="car" component="select">
                    {this.carOptions(values)}
                </Field>
                <ErrorMessage name="car" />
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
                <button type="button" onClick={() => this.callPutData(this.state.repairIdUpdate, values)}>UPDATE</button>
            </td>
        </tr>
      )
    }
  
    newRepairForm = () => {
      return (
        <tr style={this.rowColStyles()}>
            <td>
                <Field name="car" component="select" placeHolder="car">
                    {this.carOptions()}
                </Field>
                <ErrorMessage name="car" />
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
                <Field type="text" name="cost" placeHolder="Cost" />
                <ErrorMessage name="cost" />
            </td>
            <td>
                <Field name="progress" placeHolder="Progress" component="select" >
                    <option value="">Select Progress</option>
                    <option value="ready">Ready</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                </Field>
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
  
    getRepairsDisplay = (setValues, values) => {
        var repairsDisplay;
        if (this.state.repairs == null) {
            repairsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
        } else {
            repairsDisplay = this.state.repairs.map((repair) => { 
            if (this.state.shouldGetPutData && repair._id === this.state.repairIdUpdate) {
                return (this.updateRepairForm(values));
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
        car: Yup.string("No Car Selected")
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
  
    render() {
  
        return(
            <div>
                <Formik
                initialValues = {{car: '', description: '', date: '', cost: '', progress: '', technician: ''}}
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
                        <th>Date Admitted</th>
                        <th>Decription</th>
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