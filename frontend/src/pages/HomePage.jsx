import Wants from "/src/components/Wants"
import UserBooks from "/src/components/UserBooks"
import { Button } from "/src/components/ui/Button"
import { getNYTBestSellers } from "@/services/item"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import NavCard from "@/components/NavCard"
import { pageStyles, pageTitleStyles } from "@/utils/styles"

const HomePage = () => {
  const [expanded, setExpanded] = useState({
    wants: false,
    books: false,
    recommendations: false,
  })
  const { data, isLoading, isError } = useQuery({
    queryKey: ["bestSellers"],
    queryFn: getNYTBestSellers,
  })
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading best sellers</div>
  }
  return (
    <div className={`${pageStyles}`}>
      <h1 className={`${pageTitleStyles}`}>Home</h1>
      <h2 className="text-xl">Recommendations</h2>
      <hr className="border-1/2 border-gray-300 mb-2" />
      <div className="h-45 flex flex-row flex-wrap overflow-hidden">
        {data && data.length > 0 ? (
          data.map((book) => (
            <NavCard item={book} itemType="books" key={book._id} />
          ))
        ) : (
          <div>No recommendations available</div>
        )}
      </div>
      <div className="flex flex-row justify-between items-end">
        <h2 className="text-xl">Wants</h2>
        <p
          className="text-sm mr-4 hover:underline cursor-pointer"
          onClick={() => setExpanded({ ...expanded, wants: !expanded.wants })}
        >
          {expanded.wants ? "shrink" : "expand"}
        </p>
      </div>
      <hr className="border-1/2 border-gray-300 mb-2" />
      <div className={`${expanded.wants ? "h-full" : "h-41"}  overflow-hidden`}>
        <Wants />
      </div>

      <div className="flex flex-row justify-between items-end">
        <h2 className="mt-6 text-xl">Books</h2>
        <p
          className="text-sm mr-4 hover:underline cursor-pointer "
          onClick={() => setExpanded({ ...expanded, books: !expanded.books })}
        >
          {expanded.books ? "shrink" : "expand"}
        </p>
      </div>
      <hr className="border-1/2 border-gray-300 mb-2" />
      <div
        className={`${expanded.books ? "h-full" : "h-83 "} overflow-hidden mb-4`}
      >
        <UserBooks />
      </div>
    </div>
  )
}

export default HomePage
