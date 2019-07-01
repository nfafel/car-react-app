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
            car: JSON.parse(values.car),
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
        car: JSON.parse(values.car),
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
