import React, {Component} from 'react';
import './App.css';

const queryFunctions = require('./graphQLQueriesForRepairs')

class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state = {
            repairs: null
        }
    }
    
    componentDidMount() {
        queryFunctions.getRepairsData()
            .then(res => this.setState({ repairs: res }))
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

    reverseRepairsDisplay = (repairsDisplay) => {
        var reversedRepairsDisplay = [];
        for (var i=repairsDisplay.length-1; i>=0; i--) {
            reversedRepairsDisplay.push(repairsDisplay[i]);
        }
        return reversedRepairsDisplay;
    }

    getRepairsDisplay = () => {
        var repairsDisplay = [];
        var numRepairs = this.state.repairs.length;
        for (var i=numRepairs-1; i>=0; i--) {
            var repair = this.state.repairs[i];
            if (numRepairs <= 5 || i >= numRepairs-5) {
                repairsDisplay.push(
                    <tr style={this.rowColStyles}>
                        <td>{repair.car.year} {repair.car.make} {repair.car.model}</td>
                        <td>{repair.date.split('T', 1)}</td>
                        <td>{repair.description}</td>
                        <td>${repair.cost}</td>
                        <td>{repair.progress}</td>
                        <td>{repair.technician}</td>
                    </tr>
                )
            }
        }
    
        return repairsDisplay;
    }
    
    render() {
        if (this.state.repairs == null) {
            return <p style={{fontSize: 16, fontWeight: "bold"}}>Loading...</p>
        }

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