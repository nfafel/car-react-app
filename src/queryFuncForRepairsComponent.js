exports.getCarsData = async(phoneNumber) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/cars/${phoneNumber}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body);
    }
    return body.cars;
};

exports.getRepairsData = async(phoneNumber) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${phoneNumber}`);
    const body = await response.json();

    if (response.status !== 200) {
    throw Error(body) 
    }
    return body.repairs;
};

exports.deleteData = async(repairId) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
      method: 'DELETE'
    });
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body) 
    }
    return body.repairId;
}

exports.putData = async(repairId, values, phoneNumber) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
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
    return body.repair;
}

exports.postData = async(values, phoneNumber) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: phoneNumber,
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
    return body.repair;
}

exports.notifyRepairChange = async(crudType, repair, car, phoneNumber) => {
    try {
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/notifyRepair/+${phoneNumber}`, {
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