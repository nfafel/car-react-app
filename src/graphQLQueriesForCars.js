import ApolloClient, {gql} from "apollo-boost";

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

export const getCarsData = async() => {
  const result = await client.query({
    query: gql`
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
  return result.data;
};

export const deleteData = async(carId) => {
  const result = await client.mutate({
    mutation: gql` 
      mutation {
        removeCar(id: "${carId}") {
          _id 
          make
          model 
          year
          rating
        }
      }
    `
  });
  return result.data;
}

export const putData = async(carId, values) => {
  var carUpdates= {
    make: values.make,
    model: values.model,
    year: values.year,
    rating: values.rating
  };
  const result = await client.mutate({
    mutation: gql`
      mutation {
        updateCar(id: ${carId}, input: ${carUpdates}) {
          _id 
          make
          model 
          year
          rating
        }
      }
    `
  });
  return result.data;
}

export const postData = async(values) => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        rating: values.rating
      })
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
}

export const getRepairsForCar = async(repairsForCarId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairsForCarId}/repairsForCar`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body);
    }
    return body;
};

export const getAllCarYears = async() => {
  const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars/years');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};

export const getAllCarMakes = async(year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/makes/${year}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};

export const getAllCarModels = async(make, year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/models/${year}/${make}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};