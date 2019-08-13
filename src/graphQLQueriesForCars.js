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

export const getCarsData = async(phoneNumber) => {
  const result = await client.query({
    query: gql`
      query {
        cars(phoneNumber: ${phoneNumber}) {
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
  return result.data.removeCar;
}

export const putData = async(carId, values, phoneNumber) => {
  const result = await client.mutate({
    variables: {input: {
      phoneNumber: phoneNumber,
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      rating: parseInt(values.rating)
    }},
    mutation: gql`
      mutation CarUpdatesInput($input: CarInput){
        updateCar(id: "${carId}", input: $input) {
          _id 
          make
          model 
          year
          rating
        }
      }
    `
  });
  return result.data.updateCar;
}

export const postData = async(values, phoneNumber) => {
  const result = await client.mutate({
    variables: {input: {
      phoneNumber: phoneNumber,
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      rating: parseInt(values.rating)
    }},
    mutation: gql`
      mutation NewCarInput($input: CarInput){
        createCar(input: $input) {
          _id 
          make
          model 
          year
          rating
        }
      }
    `
  });
  return result.data.createCar;
}

export const getRepairsForCar = async(repairsForCarId) => {
  const result = await client.query({
    query: gql`
      query {
        repairsForCar(carId: "${repairsForCarId}") {
          date
          description
          cost
          progress
          technician
        }
      }
    `
  });
  return result.data.repairsForCar;
};

export const getAllCarYears = async() => {
  const result = await client.query({
    query: gql`
      query {
        allYears {
          min_year
          max_year
        }
      }
    `
  });
  return result.data.allYears;
};

export const getAllCarMakes = async(year) => {
  const result = await client.query({
    query: gql`
      query {
        allMakes(year: ${year}) {
          make_id
          make_display
          make_is_common
          make_country
        }
      }
    `
  });
  return result.data.allMakes;
};

export const getAllCarModels = async(make, year) => {
  const result = await client.query({
    query: gql`
      query {
        allModels(year: ${year}, make: "${make}") {
          model_name
          model_make_id
        }
      }
    `
  });
  return result.data.allModels;
};