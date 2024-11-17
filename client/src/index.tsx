import ReactDOM from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
// The Apollo Client simplifies the process of consuming GraphQL APIs from the frontend.
// Apollo Client features normalized caching, which allows for efficient storage and retrieval of data on the client side.
// This helps in avoiding redundant API calls and improves performance.
import "./index.css";
import { setContext } from "@apollo/client/link/context";

import App from "./App";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = "67375be9ac5d68d5cc7b784a"; //localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  uri: "http://localhost:4000/",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
