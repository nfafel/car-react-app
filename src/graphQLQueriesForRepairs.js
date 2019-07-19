import ApolloClient, {gql} from "apollo-boost";

const client = new ApolloClient({
  uri: "https://tranquil-caverns-41069.herokuapp.com/graphql"
});

client.defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only'
  },
  query: {
    fetchPolicy: 'network-only'
  }
}

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
                removeRepair(id: "${repairId}") {
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
    return result.data.removeRepair;
}

export const putData = async(repairId, values) => {
    const result = await client.mutate({
        variables: { input: {
            car_id: values.car_id,
            description: values.description,
            date: values.date,
            cost: values.cost,
            progress: values.progress,
            technician: values.technician
        }},
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
        variables: { input: {
            car_id: values.car_id,
            description: values.description,
            date: values.date,
            cost: parseInt(values.cost),
            progress: values.progress,
            technician: values.technician
        }},
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