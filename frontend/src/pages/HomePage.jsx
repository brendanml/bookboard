import Wants from "/src/components/Wants"
import UserBooks from "/src/components/UserBooks"
import { Button } from "/src/components/ui/Button"
import { getNYTBestSellers } from "@/services/item"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import NavCard from "@/components/NavCard"

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
    <div className="pl-4 flex flex-col">
      <h1 className="text-6xl">Home</h1>
      <h2 className="pt-3.5 text-xl">Recommendations</h2>
      <hr className="border-1/2 border-gray-300" />
      <div className="h-50 flex flex-row flex-wrap overflow-hidden">
        {data && data.length > 0 ? (
          data.map((book) => (
            <NavCard item={book} itemType="books" key={book._id} />
          ))
        ) : (
          <div>No recommendations available</div>
        )}
      </div>
      <div className="flex flex-row justify-between items-end">
        <h2 className="pt-0 text-xl">Wants</h2>
        <p
          className="text-sm mr-4 hover:underline cursor-pointer"
          onClick={() => setExpanded({ ...expanded, wants: !expanded.wants })}
        >
          {expanded.wants ? "shrink" : "expand"}
        </p>
      </div>
      <hr className="border-1/2 border-gray-300" />
      <div className={`${expanded.wants ? "h-full" : "h-43"}  overflow-hidden`}>
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
      <hr className="border-1/2 border-gray-300" />
      <div
        className={`${expanded.books ? "h-full" : "h-90"} overflow-hidden mb-4`}
      >
        <UserBooks />
      </div>
    </div>
  )
}

export default HomePage
