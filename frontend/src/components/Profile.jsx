import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "../services/user"
import { useContext } from "react"
import { UserContext } from "./UserContext"
import { Link, useNavigate } from "react-router-dom"

const Profile = () => {
  const [user, setUser] = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const logoutSuccess = await logoutUser()
      console.log("successful logout", logoutSuccess)
      setUser({ type: "LOGOUT" })
      navigate("/account/login")
    } catch (e) {
      console.error(e, "problem logging out")
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer"
        data-testid="profile-trigger"
      >
        {user ? user.email : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/account">
          <DropdownMenuItem className="cursor-pointer">
            Personal Information
          </DropdownMenuItem>
        </Link>
        <Link to="/user/items">
          <DropdownMenuItem>My Items</DropdownMenuItem>
        </Link>
        <DropdownMenuItem>My Wants</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile
