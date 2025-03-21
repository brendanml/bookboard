import { createContext, useReducer, useEffect } from "react"
import Cookie from "js-cookie"
import { getUser } from "../services/user"

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload
    case "LOGOUT":
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, setUser] = useReducer(userReducer, null)

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser()
      if (user.email) {
        setUser({ type: "LOGIN", payload: user })
      }
    }
    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={[user, setUser]}>
      {props.children}
    </UserContext.Provider>
  )
}

export { UserContext }
