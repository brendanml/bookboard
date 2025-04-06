import { useUser } from "../contexts/UserContext"
import AccountForm from "../components/forms/AccountForm"
import { pageStyles, pageTitleStyles } from "@/utils/styles"

const AccountPage = () => {
  const { user } = useUser()

  return (
    <div className={`${pageStyles}`}>
      <h1 className={`${pageTitleStyles}`}>Account</h1>
      <h1>{user ? `Welcome, ${user.email}!` : "Welcome, Guest."} </h1>
      <AccountForm />
    </div>
  )
}

export default AccountPage
