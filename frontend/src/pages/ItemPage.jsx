import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getItem } from "../services/item"
import { Button } from "../components/ui/button"
import { useAddWant } from "../hooks/userWantsHooks"

const ItemPage = () => {
  const { id } = useParams()
  const addWantMutation = useAddWant()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["item", id],
    queryFn: () => getItem(id),
  })

  const handleAddWant = () => {
    const newWant = {
      title: data.title,
      description: data.description,
      image: data.image,
      author: data.author,
      isbn: data._id,
    }
    try {
      addWantMutation.mutate(newWant)
      
      // Optionally, show a success notification
    } catch (e) {
      console.error(e)
      // Optionally, show an error notification
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error fetching item</div>
  }
  console.log(data)

  return data ? (
    <div className="grid grid-cols-4 p-2 gap-2">
      <div className="col-span-1 row-span-2">
        <img
          className="rounded-sm border-1 border-gray-200 shadow-md"
          src={data.image}
          alt={data.title}
        />
      </div>
      <div className="col-span-3 h-full">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-lg col-">
          By: <span className="italic">{data.author || "unkown"}</span>
        </p>
        <p className="text-lg">ISBN: {data._id}</p>
        <Button className="self-end" onClick={handleAddWant}>
          Add to Wants
        </Button>
      </div>
      <div className="col-span-4 p-2 rounded-md border-1 border-gray-200 shadow-md">
        <p className="text-lg">{data.description}</p>
      </div>
    </div>
  ) : null
}

export default ItemPage
