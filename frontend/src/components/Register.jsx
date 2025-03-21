//REACT QUERY
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import { createUser } from "../services/user"
import { useTimedNotification } from "./NotificationContext"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
//TODO
// - validate forms by expected before submission

const Register = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    postalcode: "",
  })

  const [notification, setTimedNotification] = useTimedNotification()

  const updateUserChange = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const createdUser = await createUser(user)
      setUser({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        postalcode: "",
      })
      setTimedNotification("User created successfully", "success", 3000)
      navigate("/account/login")
    } catch (error) {
      setTimedNotification("Problem creating user", "bad", 3000)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1>Register</h1>
      <form className="flex flex-col space-y-4 w-1/4" onSubmit={handleRegister}>
        <Input
          onChange={updateUserChange}
          type="text"
          placeholder="Firstname..."
          name="firstname"
          id="firstname"
          value={user.firstname}
        />
        <Input
          onChange={updateUserChange}
          type="text"
          placeholder="lastname..."
          name="lastname"
          id="lastname"
          value={user.lastname}
        />
        <Input
          onChange={updateUserChange}
          type="email"
          placeholder="email..."
          name="email"
          id="email"
          value={user.email}
        />
        <Input
          onChange={updateUserChange}
          type="password"
          placeholder="password..."
          name="password"
          id="password"
          value={user.password}
        />
        <Input
          onChange={updateUserChange}
          type="text"
          placeholder="postalcode..."
          name="postalcode"
          id="postalcode"
          value={user.postalcode}
        />
        <Button className="cursor-pointer" type="submit">
          Register
        </Button>
      </form>
    </div>
  )
}

export default Register
