import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutUser } from "../services/user"
import { Link, useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

const Profile = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const logoutSuccess = await logoutUser()
      console.log("successful logout", logoutSuccess)
      setUser({ type: "LOGOUT" })
      navigate("/")
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
          <DropdownMenuItem className="cursor-pointer">
            My Items
          </DropdownMenuItem>
        </Link>
        <Link to="/wants/create">
          <DropdownMenuItem className="cursor-pointer">
            My Wants
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Profile
