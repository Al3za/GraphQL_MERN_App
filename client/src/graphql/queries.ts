import { gql } from "@apollo/client";

export const GET_USERS = gql`
query GetUsers {
  users {
    _id 
    username
    password
    email
  }
}
`; // the object data here directly refears to the data stored in mongoDB
// so if we write id here instaead of _id like in mongo, we ll get no data
// pluss _id is under the ! Mark witch means that the data must have a value
// {_id: new ObjectId('6734e01240d64b801283b652'),
// username: 'Good Man',
//   password: '123',
//     email: 'good_man@gm.net'
// } thats why we have to write _id and not just id

export const GET_USER = gql`
query getUser ($id: ID!) { # ID here has to match the type Query ID. 
# the $id is the parameter we pass from getUser({variables: { id: inputId?.value }}) in out GetUser component
  user(_id: $id) { 
    _id
    username
    email
    password
  }
}
`;

export const ADD_USER = gql`
mutation sandrito($username: String, $password: String, $email: String) { # mutation name can have any name u choose
  addUser(username: $username, password: $password, email: $email){
        username
        password
        email
  }
}
`;