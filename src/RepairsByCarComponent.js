import React, {Component} from 'react';
import './App.css';

class RepairsComponent extends Component {
    constructor(props){
      super(props);
      this.state = {
        repairsForCar: null
      }
    }
    
    componentDidMount() {
        this.getRepairsForCar()
            .then(res => this.setState({ repairsForCar: res.repairsForCar }))
            .catch(err => console.log(err));
    }
  
    getRepairsForCar = async() => {
        const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/repairForCar/${this.props.carId}`);
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body);
        }
        return body;
    };

    getRepairsDisplay = () => {
        var repairsDisplay;
        if (this.state.repairsForCar == null) {
            repairsDisplay = <tr style={this.rowColStyles()}>"Loading ..."</tr>;
        } else {
            repairsDisplay = this.state.repairsForCar.map((repair) => { 
                return (
                    <tr style={this.rowColStyles()}>
                        <td>{repair.date.split('T', 1)}</td>
                        <td>{repair.description}</td>
                        <td>{repair.cost}</td>
                        <td>{repair.progress}</td>
                        <td>{repair.technician}</td>
                    </tr>
                )
            });
        }
        return repairsDisplay;
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

    getRepairTableHeading = () => {
        if (this.state.repairsForCar != null) {
            return (<h3>Repairs for the {this.state.repairsForCar[0].car.year} {this.state.repairsForCar[0].car.make} {this.state.repairsForCar[0].car.model}</h3>)
        }
    }

    render() {
  
        return(
            <div>
                {this.getRepairTableHeading()}
                <table style={this.tableStyles()}>
                <tr style={this.rowColStyles()}>
                    <th>Date</th>
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
  
  export default RepairsComponent;