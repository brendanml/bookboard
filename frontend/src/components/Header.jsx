import { Link, useLocation } from "react-router-dom"
import NotificationBanner from "./NotificationBanner"
import Profile from "./Profile"
import { useUser } from "../contexts/UserContext"
import bookboardlogo from "../assets/bookboard.png"

const navStyle = "flex justify-center space-x-4"
const baseLinkClass = "hover:bg-gray-100 rounded-md p-2 py-1 select-none" // add select-none here

const Header = () => {
  const { user } = useUser()
  const location = useLocation()

  return (
    <div className="fixed w-full top-0 left-0 flex flex-col z-50 select-none">
      <div className="flex flex-row items-center h-12 p-2 bg-white relative">
        <img src={bookboardlogo} alt="" className="h-9" draggable="false" />
        <div className={`${navStyle} fixed right-0 mr-4`}>
          <Link
            to="/home"
            draggable="false"
            className={`${baseLinkClass} ${
              location.pathname === "/home" ? "underline" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/matches"
            draggable="false"
            className={`${baseLinkClass} ${
              location.pathname === "/matches" ? "underline" : ""
            }`}
          >
            Exchanges
          </Link>

          {user ? (
            <>
              <Link
                to="/wants/create"
                draggable="false"
                className={`${baseLinkClass} ${
                  location.pathname === "/wants/create" ? "underline" : ""
                }`}
              >
                Add Want
              </Link>
              <Link
                to="/listings/create"
                draggable="false"
                className={`${baseLinkClass} ${
                  location.pathname === "/listings/create" ? "underline" : ""
                }`}
              >
                Add Listing
              </Link>
              <Profile />
            </>
          ) : (
            <Link
              to="/"
              draggable="false"
              className={`${baseLinkClass} ${
                location.pathname === "/" ? "underline" : ""
              }`}
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <hr className="border-1 border-gray-100 w-full" />
      <NotificationBanner />
    </div>
  )
}

export default Header
