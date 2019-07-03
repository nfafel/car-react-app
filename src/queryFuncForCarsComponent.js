exports.getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body;
};

exports.getCarById = async(carId) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};

exports.deleteData = async(carId) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'DELETE'
  });
  const body = await response.json();

  if (response.status !== 200) {
      throw Error(body) 
  }
  return body;
}

exports.deleteRepairsWithCar = async(carId) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}/repairs`, {
      method: 'DELETE'
  });
  const body = await response.json();

  if (response.status !== 200) {
      throw Error(body) 
  }
  return body;
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
    return body;
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
    return body;
}

exports.getRepairsForCar = async(repairsForCarId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/repairForCar/${repairsForCarId}`);
    const body = await response.json();

    if (response.status !== 200) {
        throw Error(body);
    }
    return body;
};

exports.getAllCarYears = async() => {
  const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars/years');
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};

exports.getAllCarMakes = async(year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/makes/${year}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};

exports.getAllCarModels = async(make, year) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/models/${year}/${make}`);
  const body = await response.json();

  if (response.status !== 200) {
    throw Error(body) 
  }
  return body;
};
