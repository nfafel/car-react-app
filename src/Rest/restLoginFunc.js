export const prepareLogin = async(values, context) => { 
    var parsedNumber = `1${values.phoneNumber.replace(/-|\(|\)/g, "")}`;
    
    try{
        const userResponse = await fetch(`https://tranquil-caverns-41069.herokuapp.com/users/login`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: parsedNumber,
                password: values.password
            })
        })
        const body = await userResponse.json();
        if(body.message) {
            alert(body.message)
        } else {
            confirmLogin(parsedNumber, body.token, context);
        }

    } catch(err) {
        console.log(err)
    }
}

const confirmLogin = async(parsedNumber, token, context) => {
    var confirmationNumber = Math.floor(Math.random() * 900000) + 100000;
    try{
        fetch(`https://tranquil-caverns-41069.herokuapp.com/sms/${parsedNumber}/sendConfirmation`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                confirmationNumber: confirmationNumber.toString()
            })
        });
        context.setState({
            phoneNumber: parsedNumber,
            token: token,
            confirmationNumber: confirmationNumber,
            loginForm: 'closed',
            confimationForm: 'open'
        })
    } catch(err) {
        console.log(err)
    }
}

export const login = async(values, context) => {
    if (values.confirmationNumber === context.state.confirmationNumber) {
        try {
            context.props.loginUser(context.state.token, values.queryType);
        } catch(err) {
            console.log(err)
        }

    } else {
        if (context.state.incorrectGuesses < 2) {
            alert("The confirmation number you provided is incorrect. Please try again.")
            context.setState({
                incorrectGuesses: context.state.incorrectGuesses+1
            })
        } else {
            alert("You have attempted to login too many times. Please restart.")
            context.setState({
                incorrectGuesses: 0,
                passwordForm: "closed",
                confirmationNumber: null,
                token: null
            })
        }
    }
}