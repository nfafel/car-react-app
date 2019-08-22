
exports.getCarsData = async(token) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const body = await response.json();

  if (response.status !== 200) {
    var error = new Error(body.message);
    error.statusCode = response.status;
    throw error;
  }
  return body.cars;
};

exports.deleteData = async(carId, token) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const body = await response.json();

  if (response.status !== 200) {
    var error = new Error(body.message);
    error.statusCode = response.status;
    throw error;
  }
  return body.carId;
}

exports.putData = async(carId, values, token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      var error = new Error(body.message);
      error.statusCode = response.status;
      throw error;
    }
    return body.car;
}

exports.postData = async(values, token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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
      var error = new Error(body.message);
      error.statusCode = response.status;
      throw error;
    }
    return body.car;
}

exports.getRepairsForCar = async(repairsForCarId, token) => {
  const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairsForCarId}/repairsForCar`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const body = await response.json();

  if (response.status !== 200) {
    var error = new Error(body.message);
    error.statusCode = response.status;
    throw error;
  }
  return body.repairsForCar;
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

exports.notifyCarChange = async(crudType, values, phoneNumber) => {
  try {
    fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${phoneNumber}/notifyCar`, {
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
  } catch(err) {
    alert(err)
  }
}