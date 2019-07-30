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
      }
    }

    componentDidMount() {
        queryFunctions.getAllCarYears()
            .then(res => this.setState({ yearsRange: res }))
            .catch(err => alert(err));

        if (this.props.values.year !== "") {
            queryFunctions.getAllCarMakes(this.props.values.year)
                .then(res => this.setState({ allMakes: res }))
                .catch(err => alert(err));

            queryFunctions.getAllCarModels(this.props.values.make, this.props.values.year)
                .then(res => this.setState({ allModels: res }))
                .catch(err => alert(err));
        }
    }

    getYearOptions = () => {
        if (this.state.yearsRange == null) {
            return <option value="">Loading...</option>
        }

        var allYears = [<option value="">Select a Year</option>];
        for (var i = this.state.yearsRange.max_year; i>=this.state.yearsRange.min_year; i--) {
            allYears.push(<option value={i}>{i}</option>);
        }
        return allYears;
    }

    getMakeOptions = (values) => {
        if (values.year === "") {
            return [<option value="">No Year Chosen</option>]
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

    getModelOptions = (values) => {
        if (values.make === "") {
            return [<option value="">No Make Chosen</option>]
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

    async handleYearChange(event) {
        const selectedYear = event.target.value;

        if (selectedYear !== "") {
            queryFunctions.getAllCarMakes(selectedYear)
                .then(res => this.setState({ allMakes: res }))
                .catch(err => alert(err));
        }

        await this.props.setFieldValue('model', "");
        await this.props.setFieldValue('make', "");
        await this.props.setFieldValue('year', selectedYear);
    }

    async handleMakeChange(event) {
        const selectedMake = event.target.value;

        if (selectedMake !== "") {
            queryFunctions.getAllCarModels(selectedMake, this.props.values.year)
                .then(res => this.setState({ allModels: res }))
                .catch(err => alert(err));
        }

        await this.props.setFieldValue('model', "");
        await this.props.setFieldValue('make', selectedMake);
    }

    async handleModelChange(event) {
        const selectedModel = event.target.value;
        this.props.setFieldValue('model', selectedModel);
    }
    
    render() {
        
        return (
            <tr>
                <td>
                    <Field onChange={(e) => this.handleYearChange(e)} component="select" name="year" placeHolder="Year" >
                        {this.getYearOptions()}
                    </Field>
                    <ErrorMessage name="year" />
                </td>
                <td>
                    <Field onChange={(e) => this.handleMakeChange(e)} component="select" name="make" placeHolder="Make" >
                        {this.getMakeOptions(this.props.values, this.props.setFieldValue)}
                    </Field>
                    <ErrorMessage name="make" />
                </td>
                <td>
                    <Field onChange={(e) => this.handleModelChange(e)} component="select" name="model" placeHolder="Model" >
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

