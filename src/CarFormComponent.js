import { Field, ErrorMessage } from 'formik';
import React, {Component} from 'react';

const queryFunctions = require('./queryFuncForCarsComponent');

class CarFormComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        yearsRange: null, 
        allMakes: null,
        allModels: null,
        newCarYear: null,
        newCarMake: null
      }
    }

    componentDidMount() {
        queryFunctions.getAllCarYears()
            .then(res => this.setState({ yearsRange: res.Years }))
            .catch(err => alert(err));
    }

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
            if (!this.props.shouldGetPutData) {
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
            if (!this.props.shouldGetPutData) {
                setFieldValue('model', "");
            }
            this.setState( {newCarMake: values.make} );
            
            queryFunctions.getAllCarModels(values.make, values.year)
                .then(res => this.setState({ allModels: res.Models }))
                .catch(err => alert(err));

        }

        if (this.state.allModels == null) {
            return (<option value="">Loading...</option>)
        }

        var allModels;
        allModels = this.state.allModels.map((model) => {
            return (<option value={model.model_name}>{model.model_name}</option>);
        })
        allModels.splice(0,0, <option value="">Select a Model</option>);
        return allModels;
    }

    render() {
        
        return (
            <tr>
                <td>
                    <Field component="select" name="year" placeHolder="Year" >
                        {this.getYearOptions()}
                    </Field>
                    <ErrorMessage name="year" />
                </td>
                <td>
                    <Field component="select" name="make" placeHolder="Make" >
                        {this.getMakeOptions(this.props.values, this.props.setFieldValue)}
                    </Field>
                    <ErrorMessage name="make" />
                </td>
                <td>
                    <Field component="select" name="model" placeHolder="Model" >
                        {this.getModelOptions(this.props.values, this.props.setFieldValue)}
                    </Field>
                    <ErrorMessage name="model" />
                </td>
                <td>
                    <Field type="text" name="rating" placeHolder="Rating" />
                    <ErrorMessage name="rating" />
                </td>
                <td>
                    <button type="button" onClick={this.props.cancel}>CANCEL</button>
                    <button type="submit">{this.props.buttonText}</button>
                </td>
            </tr>
        )
    }
}

export default CarFormComponent;

