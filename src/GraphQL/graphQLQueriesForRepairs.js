import gql from "graphql-tag";
import client from './apolloClient'

export const getRepairsData = async() => {
    const result = await client.query({
        query:gql`
            query {
                repairs {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost
                    progress
                    technician
                }
            }
        `
    });
    return result.data.repairs;
};

export const deleteData = async(repairId) => {
    const result = await client.mutate({
        mutation:gql`
            mutation {
                removeRepair(id: "${repairId}") 
            }
        `
    });
    return result.data.removeRepair;
}

export const putData = async(repairId, values) => {
    const result = await client.mutate({
        variables: {
            input: {
                car_id: values.car_id,
                description: values.description,
                date: values.date,
                cost: values.cost,
                progress: values.progress,
                technician: values.technician
            }
        },
        mutation:gql`
            mutation UpdateRepairInput($input: RepairInput){
                updateRepair(id: "${repairId}", input: $input) {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost 
                    progress
                    technician
                }
            }
        `
    });
    return result.data.updateRepair;
}

export const postData = async(values) => {
    const result = await client.mutate({
        variables: { 
            input: {
                car_id: values.car_id,
                description: values.description,
                date: values.date,
                cost: parseInt(values.cost),
                progress: values.progress,
                technician: values.technician
            }
        },
        mutation:gql`
            mutation NewRepairInput($input: RepairInput){
                createRepair(input: $input) {
                    _id
                    car {
                        _id
                        make
                        model
                        year
                        rating
                    }
                    date
                    description
                    cost 
                    progress
                    technician
                }
            }
        `
    });
    return result.data.createRepair;
}

export const notifyRepairChange = async(crudType, repair, car, phoneNumber) => {
    try {
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${phoneNumber}/notifyRepair`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                crudType: crudType,
                car: `${car.year} ${car.make} ${car.model}`,
                description: `${repair.description}`
            })
        });
    } catch(err) {
        console.log(err);
    }
}