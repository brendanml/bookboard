import { getUserBooks } from "../services/user"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Button } from "/src/components/ui/button"
import { deleteUserBook } from "/src/services/user"
import { useTimedNotification } from "./NotificationContext"

const UserBooks = () => {
  const queryClient = useQueryClient()
  const [notification, setTimedNotification] = useTimedNotification()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userBooks"],
    queryFn: getUserBooks,
  })

  const deleteMutation = useMutation({
    mutationFn: (bookId) => deleteUserBook(bookId),
    onSuccess: () => {
      // Invalidate the query to refetch the list after deletion
      queryClient.invalidateQueries(["userBooks"])
    },
  })

  const handleDelete = (bookId) => {
    try {
      deleteMutation.mutate(bookId)
      setTimedNotification("Book deleted", "success", 3000)
    } catch (e) {
      console.error(e)
      setTimedNotification("Error deleting book", "error", 3000)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  console.log(data)
  if (isError) {
    return <div>Error</div>
  }

  return (
    <div>
      <h1>My Books</h1>
      <div className={"flex flex-row flex-wrap"}>
        {data &&
          data.map((listing) => (
            <div
              className="w-96 h-50 shadow-md m-2 p-2 rounded-md grid grid-cols-2 grid-rows-4 gap-y-1"
              key={listing._id}
            >
              <div className="col-span-1">
                <h2 className="text-xl font-bold">{listing.item.title}</h2>
                <p>{listing.description}</p>
                <p className="col-span-1">Price: ${listing.price}</p>
                <div></div>
                <p className="col-span-1">Quantity: {listing.quantity}</p>
                <div>
                  <Button
                    className="w-1/3 bg-red-600 cursor-pointer"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Remove
                  </Button>
                  <Button variant="outline" className="w-1/3 cursor-pointer">
                    Edit
                  </Button>
                </div>
              </div>
              <div className="col-span-1 row-span-4 w-full">
                <img
                  src={listing.item.image}
                  alt={listing.item.title}
                  className="w-fit h-full m-auto gr"
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default UserBooks
