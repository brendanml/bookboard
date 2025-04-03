import { useUserWants, useDeleteWant } from "@/hooks/userWantsHooks"
import { useNavigate } from "react-router-dom"

const Wants = () => {
  const { data, isLoading, isError } = useUserWants()
  const deleteWantMutation = useDeleteWant()
  const navigate = useNavigate()
  const handleNavigate = (want) => {
    navigate(`/books/${want._id || want.isbn}`)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching wants</div>
  }

  const handleDelete = async (wantId) => {
    deleteWantMutation.mutate(wantId)
  }

  return (
    Array.isArray(data) && (
      <div className="flex flex-row flex-wrap">
        {data.map((want) => (
          <div className="relative group m-1" key={want._id || Date.now()}>
            {/* Overlay that responds to the parent's group hover */}
            <div className="absolute inset-0 bg-gray-200 opacity-0 group-hover:opacity-30 transition-all duration-300 ease-in-out pointer-events-none z-9">
              {/* Empty div, just for the overlay effect */}
            </div>

            {/* Delete button as a separate element with pointer events */}
            <div
              className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out hover:cursor-pointer"
              onClick={() => {
                handleDelete(want._id)
              }}
            >
              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border-1 border-black">
                <img
                  src="/src/assets/exit.svg"
                  alt="Delete"
                  className="w-2 h-2"
                />
              </div>
            </div>
            <div
              className="absolute left-1 bottom-1  z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
              onClick={() => handleNavigate(want)}
            >
              <p className="rounded-xl p-1 bg-white hover:cursor-pointer border-1 border-black">
                view
              </p>
            </div>
            <img
              src={want.image}
              alt={want.title}
              className="h-40 rounded-sm"
            />
          </div>
        ))}
      </div>
    )
  )
}

export default Wants
