import { useLazyQuery } from "@apollo/client";
import { LOGIN_USER } from "../graphql/queries";

const UserLogin = () => {
  let inputName: HTMLInputElement | null;
  let inputPassword: HTMLInputElement | null;
  const [VerifyUser, { loading, error, data }] = useLazyQuery(LOGIN_USER);
  if (loading) return <p>'Submitting...'</p>;
  console.log(data?.user, "Jwt token");
  return (
    <div>
      {error && <p>`Submission error! ${error.message}`</p>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          VerifyUser({
            variables: {
              username: inputName?.value,
              password: inputPassword?.value,
            },
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
        <button type="submit">Add User</button>
      </form>
    </div>
  );
};

export default UserLogin;
