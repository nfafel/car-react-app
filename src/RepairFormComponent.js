import { Field, ErrorMessage } from 'formik';
import React, {Component} from 'react';

class RepairFormComponent extends Component {

    carOptions = () => {
        var carOptions = this.props.cars.map((car) => {
            return (
                <option value={car._id} >
                    {car.year} {car.make} {car.model}
                </option>
            )
        });
        
        carOptions.splice(0,0, <option value=''>Select a Car</option>);

        return carOptions;
    }

    updateRepairForm = (values) => {
        return (
          <tr>
              <td>
                  <Field name="car_id" component="select" value={values.car_id}>
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
                  <button type="button" onClick={this.props.cancel}>CANCEL</button>
                  <button type="submit">UPDATE</button>
              </td>
          </tr>
        )
    }

    newRepairForm = () => {
        return (
          <tr>
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
                  <button type="button" onClick={this.props.cancel}>CANCEL</button>
                  <button type="submit">SUMBIT</button>
              </td>
          </tr>
    )}

    render() {

        if (this.props.formType === "update") {
            return (this.updateRepairForm(this.props.values))
        } else {
            return (this.newRepairForm());
        }
    }
}

export default RepairFormComponent;