exports.getCarsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/cars');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body);
    }
    return body;
};

exports.getRepairsData = async() => {
    const response = await fetch('https://tranquil-caverns-41069.herokuapp.com/repairs');
    const body = await response.json();

    if (response.status !== 200) {
    throw Error(body) 
    }
    return body;
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

exports.notifyRepairChange = async(crudType, repair, car) => {
    try {
        const numbersResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/sms`);
        const body = await numbersResponse.json();
        const numbers = body.numbers;
        numbers.forEach((number) => {
            fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/notifyRepair/+1${number.phoneNumber}`, {
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
        })
    } catch(err) {
        console.log(err);
    }
}