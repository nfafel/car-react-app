import React, {Component} from 'react';
import './App.css';

class RepairsByCarComponent extends Component {

    getRepairTableRows = () => {
        var repairsDisplay;
        repairsDisplay = this.props.repairsForCar.map((repair) => { 
            return (
                <tr style={this.props.rowColStyles}>
                    <td>{repair.date.split('T', 1)}</td>
                    <td>{repair.description}</td>
                    <td>${repair.cost}</td>
                    <td>{repair.progress}</td>
                    <td>{repair.technician}</td>
                </tr>
            )
        });
        return repairsDisplay;
    }

    render() {
        if (this.props.repairsForCar[0] === undefined) {
            return (<h3>No Repairs Recorded for the {this.props.repairCarYear} {this.props.repairCarMake} {this.props.repairCarModel}</h3>);
        }
        return(
            <div>
                <h3>Repairs for the {this.props.repairCarYear} {this.props.repairCarMake} {this.props.repairCarModel}</h3>
                <table style={this.props.tableStyles}>
                    <tr style={this.props.rowColStyles}>
                        <th>Date</th>
                        <th>Decription</th>
                        <th>Cost</th>
                        <th>Progress</th>
                        <th>Technician</th>
                    </tr>
                    {this.getRepairTableRows()}
                </table>
            </div>
        );
    }
  }
  
  export default RepairsByCarComponent;