exports.getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body.cars;
};

exports.deleteData = async(carId) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'DELETE'
  });
  const body = await response.json();

  if (response.status !== 200) {
      throw Error(body) 
  }
  return body.cars;
}

exports.putData = async(carId, values) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'PUT',
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
    return body.cars;
}

exports.postData = async(values) => {
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
    return body.cars;
}

exports.getRepairsForCar = async(repairsForCarId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairsForCarId}/repairsForCar`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body);
    }
    return body.repairsForCar;
};

exports.getAllCarYears = async() => {
  const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars/years');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body.Years;
};

exports.getAllCarMakes = async(year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/makes/${year}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body.Makes;
};

exports.getAllCarModels = async(make, year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/models/${year}/${make}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body.Models;
};

exports.notifyCarChange = async(crudType, values) => {
  try {
    const numbersResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/sms`);
    const body = await numbersResponse.json();
    const numbers = body.numbers;
    numbers.forEach((number) => {
      fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/notifyCar/+1${number.phoneNumber}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          crudType: crudType,
          car: `${values.year} ${values.make} ${values.model}`
        })
      });
    })
  } catch(err) {
    alert(err)
  }
}