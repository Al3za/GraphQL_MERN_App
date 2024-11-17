import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries";
const GetUsers = () => {
  const { data, loading, error } = useQuery(GET_USERS); //useQuery fetches data as soon as the component is rendered

  if (loading) return <p>...Loading</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data.users, "data.users");

  return (
    <table>
      <caption>Users</caption>
      <thead>
        <tr>
          <th scope="col">User ID</th>
          <th scope="col">User name</th>
          <th scope="col">User email</th>
        </tr>
      </thead>
      <tbody>
        {data.users.map(
          // users are related to the resolvers query endpoint in our server
          ({
            _id,
            username,
            email,
            password,
          }: {
            _id: string;
            username: string;
            email: string;
            password: string;
          }) => (
            <tr key={_id}>
              <td>{_id}</td>
              {/*td stands Table Data for The td element is often used within the tr (table row) element to structure and organize tabular data on a webpage.*/}
              <td>{username}</td>
              <td>{email}</td>
              <td>{password} </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default GetUsers;
