import { useUser } from "../contexts/UserContext"
import AccountForm from "../components/forms/AccountForm"

const AccountPage = () => {
  const { user } = useUser()

  return (
    <div className="p-4">
      <h1 className="text-6xl">Account</h1>
      <h1>{user ? `Welcome, ${user.email}!` : "Welcome, Guest."} </h1>
      <AccountForm />
    </div>
  )
}

export default AccountPage
