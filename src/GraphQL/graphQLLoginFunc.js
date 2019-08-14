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

export const prepareGraphQLLogin = async(values, context) => { 
    var parsedNumber = `1${values.phoneNumber.replace(/-|\(|\)/g, "")}`;
    try {
        const result = await client.mutate({
            mutation: gql`
              mutation {
                loginUser(phoneNumber: "${parsedNumber}", password: "${values.password}")
              }
            `
        });
        const token = result.data.loginUser;
        confirmGraphQLLogin(parsedNumber, token, context);
        
    } catch(err) {
        if (err.message === "GraphQL error: Invalid Credentials") {
            alert("Incorrect username or password. Please try again.");
            console.log(err);
        } else {
            console.log(err);
        }
    }
}

const confirmGraphQLLogin = async(parsedNumber, token, context) => {
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

export const graphQLLogin = async(values, context) => {
    if (values.confirmationNumber === context.state.confirmationNumber) {
        try { 
            context.props.setQueryType(values.queryType);   
            context.props.loginUser(context.state.token);
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