import { Link } from "react-router-dom";

const navStyle = "flex justify-center space-x-4";
import Profile from "./Profile";
import { UserContext } from "./UserContext";
import { useContext } from "react";

const Header = () => {
  const [user, setUser] = useContext(UserContext);
  console.log(user);
  return (
    <div className="flex justify-between p-4">
      <h1 className="text-black-700 text-lg">BOOKBOARD MARKETPLACE</h1>
      <ul className={navStyle}>
        <li>
          <Link to="/" draggable="false">
            Home
          </Link>
        </li>
        <li>
          <Link to="/listings" draggable="false">
            Listings
          </Link>
        </li>

        {user ? (
          <>
            <li>
              <Link to="/listings/create" draggable="false">
                Add Item
              </Link>
            </li>
            <Profile />
          </>
        ) : (
          <>
            <li>
              <Link to="account/register" draggable="false">
                Register
              </Link>
            </li>
            <li>
              <Link to="account/login" draggable="false">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Header;
