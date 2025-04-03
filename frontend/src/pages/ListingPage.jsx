import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getListing } from "../services/listing"
import { Button } from "/src/components/ui/button"
// import { useAddWant } from "../hooks/userWantsHooks
import NavCard from "/src/components/NavCard"
import fivestarImage from "/src/assets/5star.png"
import defaultAvatar from "/src/assets/default-avatar.png"

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
    <div className="p-2 gap-6 flex flex-row justify-center w-9/10">
      <div className="h-full">
        <NavCard item={data.item} itemType="books" size="h-80" />
        <h1 className="text-2xl font-bold">{data.item.title}</h1>
        <p className="text-lg col-">
          By: <span className="italic">{data.item.author || "unknown"}</span>
        </p>
        <p className="text-lg">ISBN: {data.item._id}</p>
        {/* <Button className="self-end" onClick={handleAddWant}>
          Add to Wants
        </Button> */}
        <div>
          <p>{data.description}</p>
        </div>
      </div>
      <div className="flex flex-col  gap-2">
        <div>
          <p>Price:</p>
          <p className="w-80 font-bold text-lg rounded-md bg-white shadow-md px-2 border-1 border-gray-200">
            ${data.price}
          </p>
        </div>

        <div>
          <p className="w-80 font-bold text-lg rounded-md bg-white shadow-md px-2 border-1 border-gray-200">
            x{data.quantity}
          </p>
          <div className="w-80 text-md rounded-md bg-white shadow-md px-2 border-1 border-gray-200 h-40">
            {data.description || "No description provided"}
          </div>
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
  ) : null
}
export default ListingPage
