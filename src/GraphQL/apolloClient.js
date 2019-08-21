import {ApolloClient} from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';

import store from '../redux/store'

const httpLink = createHttpLink({
    uri: 'https://tranquil-caverns-41069.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    console.log("authLink", store.getState())
    const token = store.getState().token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

client.defaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only'
    },
    query: {
        fetchPolicy: 'network-only'
    }
}

export default client;