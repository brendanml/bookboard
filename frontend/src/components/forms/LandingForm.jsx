import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { createUser } from "../../services/user"
import { useTimedNotification } from "../../contexts/NotificationContext"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { loginUser } from "../../services/user"
import { useUser } from "../../contexts/UserContext"

const questionStyles = {
  question: "text-sm text-center",
  link: "text-sm text-center font-bold hover:underline cursor-pointer",
}

const LandingForm = () => {
  const [formType, setFormType] = useState("login")
  const { setUser } = useUser()
  // const handleFormTypeChange = (type) => {
  //   setFormType(type)
  // }

  const navigate = useNavigate()
  const [userForm, setUserForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    postalcode: "",
  })

  const { setTimedNotification } = useTimedNotification()

  const updateUserChange = (e) => {
    const { name, value } = e.target
    setUserForm({ ...userForm, [name]: value })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const loggedInUser = await loginUser({
        email: userForm.email,
        password: userForm.password,
      })
      if (!loggedInUser) {
        setTimedNotification("Wrong username or password.", "bad", 3000)
        return
      }
      setTimedNotification("User logged in successfully", "success", 3000)
      setUser({ type: "LOGIN", payload: loggedInUser })
      navigate("/home")
      document.activeElement?.blur()
    } catch (e) {
      setTimedNotification("Wrong username or password.", "bad", 3000)
      console.log(e)
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    try {
      await createUser(userForm)
      setUserForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        postalcode: "",
      })
      setTimedNotification("User created successfully", "success", 3000)
      setFormType("login")
      document.activeElement?.blur()
    } catch (e) {
      setTimedNotification("Problem creating user", "bad", 3000)
      console.log(e)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-80">
      <h1 className="mb-2 text-gray-500 text-2xl">
        {formType === "register" ? "Create account" : "Login"}
      </h1>
      <form
        className="flex flex-col space-y-4 w-9/10"
        onSubmit={(e) => {
          formType === "register"
            ? handleRegisterSubmit(e)
            : handleLoginSubmit(e)
        }}
      >
        <Input
          onChange={updateUserChange}
          type="email"
          placeholder="Email..."
          name="email"
          id="email"
          value={userForm.email}
        />
        <Input
          onChange={updateUserChange}
          type="password"
          placeholder="Password..."
          name="password"
          id="password"
          value={userForm.password}
        />
        {formType === "register" ? (
          <>
            <Input
              onChange={updateUserChange}
              type="text"
              placeholder="First name..."
              name="firstname"
              id="firstname"
              value={userForm.firstname}
            />
            <Input
              onChange={updateUserChange}
              type="text"
              placeholder="Last name..."
              name="lastname"
              id="lastname"
              value={userForm.lastname}
            />
            <Input
              onChange={updateUserChange}
              type="text"
              placeholder="Postal code..."
              name="postalcode"
              id="postalcode"
              value={userForm.postalcode}
            />
          </>
        ) : null}
        <Button className="cursor-pointer" type="submit">
          {formType === "register" ? "Sign Up" : "Login"}
        </Button>
        <div className="flex flex-row items-center justify-between mt-5">
          {formType === "register" ? (
            <>
              <p className={questionStyles.question}>
                Already have an account?
              </p>
              <span
                onClick={() => setFormType("login")}
                className={questionStyles.link}
              >
                Log in here.
              </span>
            </>
          ) : (
            <>
              <p className={questionStyles.question}>Don't have an account?</p>
              <span
                onClick={() => setFormType("register")}
                className={questionStyles.link}
              >
                Sign up here.
              </span>
            </>
          )}
        </div>
      </form>
    </div>
  )
}

export default LandingForm
