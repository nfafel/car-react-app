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

exports.getCarsData = async() => {
    const result = await client.query({
        query:gql`
            query {
                cars {
                    _id
                    make
                    model
                    year
                    rating
                }
            }
        `
    });
    return result.data.cars;
};

exports.getRepairsData = async() => {
    const result = await client.query({
        query:gql`
            query {
                repairs {
                    car {
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

exports.deleteData = async(repairId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
}

exports.putData = async(repairId, values) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            car_id: values.car_id,
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

exports.postData = async(values) => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/repairs', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        car_id: values.car_id,
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
