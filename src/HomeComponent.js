import React, {Component} from 'react';
import './App.css';

const queryFunctions = require('./queryFuncForRepairsComponent')

class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            repairs: null,
            cars: null
        }
    }
    
    componentDidMount() {
        queryFunctions.getRepairsData()
            .then(res => this.setState({ repairs: res.repairs }))
            .catch(err => console.log(err)); 
            
        queryFunctions.getCarsData()
            .then(res => this.setState({ cars: res.cars }))
            .catch(err => console.log(err));
    }

    tableStyles = {
        "width": "80%",
        "border-collapse": "collapse",
        "border": "1px solid #dddddd",
        "margin": "1em auto"
    };

    rowColStyles = {
        "border-collapse": "collapse",
        "border": "1px solid #dddddd"
    };

    getCarForRepair = (carId) => {
        for (var i = 0; i<this.state.cars.length; i++) {
            if (this.state.cars[i]._id === carId) {
                return this.state.cars[i];
            }
        }
    }

    reverseRepairsDisplay = (repairsDisplay) => {
        var reversedRepairsDisplay = [];
        for (var i=repairsDisplay.length-1; i>=0; i--) {
            reversedRepairsDisplay.push(repairsDisplay[i]);
        }
        return reversedRepairsDisplay;
    }

    getRepairsDisplay = () => {
        var repairsDisplay = [];
        if (this.state.repairs == null) {
            repairsDisplay = <tr style={this.rowColStyles}>"Loading ..."</tr>;
        } else if (this.state.cars != null) {
            var numRepairs = this.state.repairs.length;
            for (var i=0; i<numRepairs; i++) {
                var repair = this.state.repairs[i];
                var carRepaired = this.getCarForRepair(repair.car_id);
                if (numRepairs <= 5 || i >= numRepairs-5) {
                    repairsDisplay.push(
                        <tr style={this.rowColStyles}>
                            <td>{carRepaired.year} {carRepaired.make} {carRepaired.model}</td>
                            <td>{repair.date.split('T', 1)}</td>
                            <td>{repair.description}</td>
                            <td>${repair.cost}</td>
                            <td>{repair.progress}</td>
                            <td>{repair.technician}</td>
                        </tr>
                    )
                }
            }
        }
        var formattedRepairsDisplay = this.reverseRepairsDisplay(repairsDisplay);
        return formattedRepairsDisplay;
    }
    
    render() {

        return(
            <div>
                <table style={this.tableStyles}>
                    <tr style={this.rowColStyles}>
                        <th>Car</th>
                        <th>Date Admitted</th>
                        <th>Decription</th>
                        <th>Cost</th>
                        <th>Progress</th>
                        <th>Technician</th>
                    </tr>
                    {this.getRepairsDisplay()}
                </table>
            </div>
        );
    }
  }
  
  export default HomeComponent;