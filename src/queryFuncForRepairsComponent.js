
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

exports.getRepairsData = async(token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs`, {
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
    return body.repairs;
};

exports.deleteData = async(repairId, token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
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
    return body.repairId;
}

exports.putData = async(repairId, values, token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs/${repairId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
        var error = new Error(body.message);
        error.statusCode = response.status;
        throw error;
    }
    return body.repair;
}

exports.postData = async(values, token) => {
    const response = await fetch(`https://tranquil-caverns-41069.herokuapp.com/repairs`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
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
        var error = new Error(body.message);
        error.statusCode = response.status;
        throw error; 
    }
    return body.repair;
}

// exports.notifyRepairChange = async(crudType, repair, car, phoneNumber) => {
//     try {
//         fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${phoneNumber}/notifyRepair`, {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 crudType: crudType,
//                 car: `${car.year} ${car.make} ${car.model}`,
//                 description: `${repair.description}`
//             })
//         });
//     } catch(err) {
//         console.log(err);
//     }
// }