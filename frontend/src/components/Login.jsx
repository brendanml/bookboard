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
    try {
      const loggedInUser = await loginUser(loginInfo);
      setTimedNotification("User logged in successfully", "success", 3000);
      setUser({ type: "LOGIN", payload: loggedInUser });
      navigate("/");
    } catch (error) {
      setTimedNotification("Problem logging in", "bad", 3000);
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
