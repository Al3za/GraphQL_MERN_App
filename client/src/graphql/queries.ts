import { gql } from "@apollo/client";

export const GET_USERS = gql`
query GetUsers { # query name dont need to be GetUsers
  users {
    _id 
    username
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
# the $id is the parameter we pass from getUser({variables: { id: inputId?.value }}) in ouu GetUser component
  user(_id: $id) { # here we pass the argoment _id to our server endpoint
    _id
    username
    email
    password
  }
}
`; // we tells in the query only the data we want, avoiding overfetching

export const LOGIN_USER = gql`
query UserLogin($username:String, $password: String){
UserLogin(username:$username,password:$password){
token  #here you write the output name
  }
}
`

export const ADD_USER = gql`
mutation addUser($username: String, $password: String, $email: String, $roles: [String]) { # mutation name can have any name u choose. in here we pass the args first from our client, then to our server

#the tipe we pass abowe from the component has to be the same type of the TypeDefs in our server like roles [] because its an array , otherwise we get an error;

  addUser(username: $username, password: $password, email: $email, roles: $roles){
        username
        password
        email
  } # the username password email data written in column is the data we choose to render client side. it doesnt comunicate with the server;
   #addUser(username: $username, password: $password, email: $email, roles: $roles) this data do comunicate with server;
   #addUser, UserLogin, user, users are the function we call in the server and where we pass the data to cumunicate with the db
}
`;