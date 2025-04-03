import { Link, useLocation } from "react-router-dom"
import NotificationBanner from "./NotificationBanner"

const navStyle = "flex justify-center space-x-4"
import Profile from "./Profile"
import { useUser } from "../contexts/UserContext"
import bookboardlogo from "../assets/bookboard.png"

const Header = () => {
  const { user } = useUser()
  const location = useLocation()
  console.log(location)

  return (
    <div className="fixed w-full top-0 left-0 flex flex-col  z-50">
      <div className="flex flex-row justify-between items-center h-12 p-2 bg-white">
        <img src={bookboardlogo} alt="" className="h-9" />
        <div className={navStyle}>
          <Link
            to="/home"
            draggable="false"
            className={`hover:bg-gray-100 rounded-md p-2 py-1 ${
              location.pathname === "/home" ? "underline" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/matches"
            draggable="false"
            className={`hover:bg-gray-100 rounded-md p-2 py-1 ${
              location.pathname === "/matches" ? "underline" : ""
            }`}
          >
            Matches
          </Link>

          {user ? (
            <>
              <Link
                to="/wants/create"
                draggable="false"
                className={`hover:bg-gray-100 rounded-md p-2 py-1 ${
                  location.pathname === "/wants/create" ? "underline" : ""
                }`}
              >
                Add Want
              </Link>
              <Link
                to="/listings/create"
                draggable="false"
                className={`hover:bg-gray-100 rounded-md p-2 py-1 ${
                  location.pathname === "/listings/create" ? "underline" : ""
                }`}
              >
                Add Item
              </Link>
              <Profile />
            </>
          ) : (
            <>
              <Link
                to="/"
                draggable="false"
                className={`hover:bg-gray-100 rounded-md p-2 py-1 ${
                  location.pathname === "/" ? "underline" : ""
                }`}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
      <hr className="border-1 border-gray-100 w-full" />
      <NotificationBanner />
    </div>
  )
}

export default Header
