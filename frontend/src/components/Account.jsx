import { useContext } from "react"
import { UserContext } from "./UserContext"
import { Input } from "./ui/input"

const Account = () => {
  const [user, setUser] = useContext(UserContext)

  const handleChange = () => {
    console.log("changing")
  }

  const accountForm = () => {
    return (
      <form className="w-1/3 ml-2">
        {Object.entries(user).map(([key, val]) => (
          <p key={key}>
            {key}: {<Input onChange={handleChange} value={val}></Input>}
          </p>
        ))}
      </form>
    )
  }

  return (
    <div>
      <h1 className="text-9xl">Profile Page</h1>
      {user ? <h1>Welcome {user.email}</h1> : <h1>Welcome Guest</h1>}
      {user ? accountForm() : null}
      <p>Profile page content</p>
    </div>
  )
}

export default Account
