import AddUser from "./components/AddUser";
import GetUsers from "./components/GetUsers";
import GetUser from "./components/GetUser";
import "./App.css";
import UserLogin from "./components/LoginUser";

const App = () => {
  const OnChangeTab = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    activeTab: string
  ) => {
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].setAttribute("style", "display:none");
    }
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(activeTab)?.setAttribute("style", "display:block");
    e.currentTarget.className += " active";
  };

  return (
    <>
      USERLOGIN <br />
      <UserLogin />
      <div className="tab">
        <button
          className="tablinks active"
          onClick={(e) => OnChangeTab(e, "Users")}
          style={{ display: "none" }}
        >
          Users
        </button>
        <button
          className="tablinks"
          onClick={(e) => OnChangeTab(e, "User")}
          style={{ display: "none" }}
        >
          User
        </button>
      </div>
      <div id="Users" className="tabcontent" style={{ display: "none" }}>
        <h3>Users</h3>
        {/* <UserLogin /> */}
        <AddUser />
        <GetUsers />
      </div>
      <div id="User" className="tabcontent" style={{ display: "none" }}>
        <h3>User</h3>
        <GetUser />
      </div>
    </>
  );
};

export default App;
