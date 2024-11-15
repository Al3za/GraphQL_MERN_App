import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
// The Apollo Client simplifies the process of consuming GraphQL APIs from the frontend.
// Apollo Client features normalized caching, which allows for efficient storage and retrieval of data on the client side.
// This helps in avoiding redundant API calls and improves performance.
import "./index.css";
import App from "./App";

const client = new ApolloClient({
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
