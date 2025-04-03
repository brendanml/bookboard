import UserBooks from "./UserBooks"
import Filter from "./Filter"
import { useState } from "react"

const UserItems = () => {
  // Define filter state at this level
  const [filters, setFilters] = useState({
    search: "",
    showSold: true,
    showAvailable: true,
    showBooks: true,
    showBoardgames: true,
  })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <div className="px-4">
      <Filter filters={filters} onFilterChange={handleFilterChange} />
      <UserBooks filters={filters} />
    </div>
  )
}

export default UserItems
