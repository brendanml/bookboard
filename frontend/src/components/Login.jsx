import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/user";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTimedNotification } from "./NotificationContext";
import { UserContext } from "./UserContext";

const Login = () => {
  const [notification, setTimedNotification] = useTimedNotification();
  const [user, setUser] = useContext(UserContext);

  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleUser = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("in handle login");
    console.log(loginInfo);
    try {
      const loggedInUser = await loginUser(loginInfo);
      console.log("we have logged in user:");
      console.log("************************");
      console.log(loggedInUser);
      setTimedNotification("User logged in successfully", "success", 3000);
      setUser({ type: "LOGIN", payload: loggedInUser });
      console.log("the logged in user:", loggedInUser);
      navigate("/");
    } catch (error) {
      setTimedNotification("Problem logging in", "bad", 3000);
      console.log("error logging in");
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <Input
          onChange={handleUser}
          type="email"
          placeholder="Email..."
          name="email"
        />
        <Input
          onChange={handleUser}
          type="password"
          placeholder="Password..."
          name="password"
        />
        <Button>Login</Button>
      </form>
    </div>
  );
};

export default Login;
