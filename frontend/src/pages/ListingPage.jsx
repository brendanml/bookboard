import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getListing } from "../services/listing"
import { Button } from "/src/components/ui/button"
// import { useAddWant } from "../hooks/userWantsHooks
import NavCard from "/src/components/NavCard"
import fivestarImage from "/src/assets/5star.png"
import defaultAvatar from "/src/assets/default-avatar.png"
import { pageStyles } from "@/utils/styles"

const ListingPage = () => {
  const { id } = useParams()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => getListing(id),
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error fetching listing</div>
  }

  console.log(data)

  return data ? (
    <div className={`${pageStyles}`}>
      <div className="w-4/7 m-auto justify-center grid grid-cols-2 gap-x-6">
        <div className="col-span-2 mb-4">
          {/* <p className="text-lg">ISBN: {data.item._id}</p> */}
        </div>
        <div className="h-full">
          <h1 className="text-2xl font-medium">{data.item.title}</h1>
          <p className="text-lg font-gray-700">
            By: <span className="italic">{data.item.author || "unknown"}</span>
          </p>
          <NavCard item={data.item} itemType="books" size="h-80" />
          {/* <Button className="self-end" onClick={handleAddWant}>
          Add to Wants
          </Button> */}
        </div>
        <div className="flex flex-col gap-y-3 w-80">
          <div>
            <p>Price:</p>
            <p className="text-lg rounded-md bg-white px-2 border-1 border-gray-200">
              ${data.price}
            </p>
          </div>

          <div>
            <p>Quantity:</p>
            <p className="w-full text-lg rounded-md bg-white px-2 border-1 border-gray-200">
              x{data.quantity}
            </p>
          </div>
          <div className="w-full text-md rounded-md bg-white px-2 border-1 border-gray-200 h-40 text-gray-600">
            {data.description || "No description provided"}
          </div>
          <div className="flex flex-row items-center gap-2">
            <img src={defaultAvatar} alt="" className="w-12 rounded-full" />
            <p className="text-xl">
              {data.owner.firstname} {data.owner.lastname}
            </p>
            <img src={fivestarImage} alt="" className="w-28" />
          </div>
          <Button>Inquire</Button>
        </div>
      </div>
    </div>
  ) : null
}
export default ListingPage
