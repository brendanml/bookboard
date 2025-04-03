import UserBooks from "./UserBooks"
import Filter from "./Filter"

const UserItems = () => {
  return (
    <div className="px-4">
      <Filter />
      <UserBooks />
    </div>
  )
}

export default UserItems
