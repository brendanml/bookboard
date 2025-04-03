import { Button } from "/src/components/ui/button"
import UserItemEdit from "./UserItemEdit"
import { useState } from "react"
import {
  useDeleteMutation,
  useUpdateMutation,
  useSoldMutation,
  useUserBooksQuery,
} from "@/hooks/userBooksHooks"
import { useNavigate } from "react-router-dom"

const UserBooks = () => {
  const [soldFilter] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editListing, setEditListing] = useState(null)
  const { data, isLoading, isError } = useUserBooksQuery()
  const deleteMutation = useDeleteMutation()
  const updateMutation = useUpdateMutation()
  const soldMutation = useSoldMutation()
  const navigate = useNavigate()
  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error fetching books</div>
  }

  const handleDelete = (bookId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this book? This action cannot be undone.",
    )
    if (!confirm) {
      return
    }
    deleteMutation.mutate(bookId)
  }

  return (
    <div className="w-full">
      {editing && (
        <UserItemEdit
          listing={editListing}
          setEditing={setEditing}
          updateMutation={updateMutation}
          soldMutation={soldMutation}
          editing={editing}
        />
      )}
      <div className="flex flex-row flex-wrap">
        {Array.isArray(data) ? (
          data
            .filter((listing) =>
              soldFilter ? listing.status !== "sold" : true,
            )
            .map(
              (listing) =>
                listing.item && (
                  <div
                    className="shadow-sm m-2 p-2 rounded-md flex flex-row gap-1 border-1 border-gray-100 h-40 z-10"
                    key={listing._id}
                  >
                    <img
                      src={listing.item.image}
                      alt={listing.item.title}
                      className="h-full w-auto object-contain rounded-sm cursor-pointer border-1 border-gray-200"
                      onClick={() => navigate(`/books/${listing.item._id}`)}
                    />
                    <div className="flex flex-col h-full justify-between relative">
                      <div
                        className="self-end w-3.5 h-3.5 rounded-full cursor-pointer hover:bg-gray-200 flex items-center justify-center"
                        onClick={() => handleDelete(listing._id)}
                      >
                        <img
                          src="/src/assets/exit.svg"
                          alt=""
                          className="w-2"
                        />
                      </div>
                      <p className="bg-gray-100 rounded-md p-1 text-center">
                        CAD <span className="font-bold">${listing.price}</span>
                      </p>
                      <p className="bg-gray-100 rounded-md p-1 text-center">
                        x{listing.quantity}
                      </p>
                      {/* <Button
                    variant="outline"
                    className="cursor-pointer w-20"
                    onClick={() => handleDelete(listing._id)}
                  >
                    Remove
                  </Button> */}

                      <Button
                        variant=""
                        onClick={() => {
                          setEditListing(listing)
                          setEditing(true)
                        }}
                        className="cursor-pointer w-20"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ),
            )
        ) : (
          <div>User not logged in.</div>
        )}
      </div>
    </div>
  )
}

export default UserBooks
