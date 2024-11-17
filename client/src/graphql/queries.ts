import { gql } from "@apollo/client";

export const GET_USERS = gql`
query GetUsers { # query name dont need to be GetUsers
  users {
    _id 
    username
    password
    email
  } # we tells in the query only the data we want, avoiding overfetching
   # for exemple if we dont need password, we delete it from the query so that data ll not be fetched
}
`; // the object data here directly refers to the data stored in mongoDB
// so if we write id instaead of _id like in mongo collection, we ll get no data
// pluss _id is under the ! Mark witch means that the data must have a value
// {_id: new ObjectId('6734e01240d64b801283b652'),
// username: 'Good Man',
//   password: '123',
//     email: 'good_man@gm.net'
// } thats why we have to write _id and not just id

export const GET_USER = gql`
query getUser ($id: ID!) { # ID here has to match the type Query ID. (ID is a type)
# the $id is the parameter we pass from getUser({variables: { id: inputId?.value }}) in out GetUser component
  user(_id: $id) { # here we pass the argoment _id to our server endpoint
    _id
    username
    email
    password
  }
}
`; // we tells in the query only the data we want, avoiding overfetching

export const ADD_USER = gql`
mutation addUser($username: String, $password: String, $email: String) { # mutation name can have any name u choose. in here we pass the args first from our client, then to our server
  addUser(username: $username, password: $password, email: $email){
        username
        password
        email
  }
}
`;