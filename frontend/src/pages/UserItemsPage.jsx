import UserBooks from "../components/UserBooks"
import Filter from "../components/Filter"
import { useState } from "react"
import { pageStyles, pageTitleStyles } from "@/utils/styles"

const UserItemsPage = () => {
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
    <div className={`${pageStyles}`}>
      <h1 className={`${pageTitleStyles}`}>My Inventory</h1>
      <Filter filters={filters} onFilterChange={handleFilterChange} />
      <h2 className="text-xl">My Books</h2>
      <hr className="border-1/2 border-gray-300 mb-2" />
      <UserBooks filters={filters} />
    </div>
  )
}

export default UserItemsPage
