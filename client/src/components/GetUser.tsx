import { useLazyQuery } from "@apollo/client";
import { GET_USER } from "../graphql/queries";

const GetUser = () => {
  let inputId: HTMLInputElement | null = null;
  const [getUser, { loading, error, data }] = useLazyQuery(GET_USER); //The useLazyQuery hook is perfect for executing queries in response to events other than component rendering.
  // normal useQuery calls function executes directly after the react component munt and render
  if (loading) return <p>'Submitting...'</p>;

  return (
    <div>
      {error && <p>`Submission error! ${error.message}`</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          getUser({ variables: { id: inputId?.value } }); // variables will be catched in args in the server
        }}
      >
        <input
          ref={(node) => {
            inputId = node;
          }}
          placeholder="UserId"
          required
        />
        <button type="submit">Get User</button>
        {data?.user && ( // user are related to the resolvers query endpoint in our server
          <table style={{ minWidth: 300 }}>
            <caption>User</caption>
            <tbody>
              <tr>
                <th scope="row">User ID</th>
                <td>{data?.user._id}</td>
              </tr>
              <tr>
                <th scope="row">User name</th>
                <td>{data?.user.username}</td>
              </tr>
              <tr>
                <th scope="row">User email</th>
                <td>{data?.user.email}</td>
              </tr>
            </tbody>
          </table>
        )}
        <p></p>
      </form>
    </div>
  );
};

export default GetUser;
