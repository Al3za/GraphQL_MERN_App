import { useMutation } from "@apollo/client";
import { GET_USERS, ADD_USER } from "../graphql/queries";

const AddUser = () => {
  let inputName: HTMLInputElement | null;
  let inputPassword: HTMLInputElement | null;
  let inputEmail: HTMLInputElement | null;

  const [addUser, { loading, error, client }] = useMutation(ADD_USER);

  if (loading) return <p>'Submitting...'</p>;

  return (
    <div>
      {error && <p>`Submission error! ${error.message}`</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser({
            variables: {
              // variables will be catched in server`s resolvers args
              username: inputName?.value,
              password: inputPassword?.value,
              email: inputEmail?.value,
            },
            refetchQueries: [{ query: GET_USERS }], // refetch the query once we added data so we see fresh data
            onError: () => client.refetchQueries({ include: [GET_USERS] }),
          });
        }}
      >
        <input
          ref={(node) => {
            inputName = node; // we can get the input value without having a class name
          }}
          placeholder="Name"
          required
        />
        <input
          ref={(node) => {
            inputPassword = node; // we can get the input value without having a class name
          }}
          placeholder="Password"
          required
        />
        <input
          type="email"
          ref={(node) => {
            inputEmail = node; // we can get the input value without having a class name
          }}
          placeholder="Email"
          required
        />
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default AddUser;
