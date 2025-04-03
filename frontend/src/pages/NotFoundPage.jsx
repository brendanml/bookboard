import { useNavigate } from "react-router-dom"
import { useUser } from "../contexts/UserContext"

const NotFound = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  console.log(user)
  return (
    <div className="w-full h-full flex items-center mt-40  flex-col">
      <p className="text-2xl">
        <span className="italic">Sorry</span>, this page doesn't exist...
      </p>
      <img
        src="/src/assets/unknown_endpoint.svg"
        alt=""
        className="w-24 mt-4"
      />
      <p
        onClick={() => {
          user ? navigate("/home") : navigate("/")
        }}
        className="font-bold text-sm mt-4 cursor-pointer hover:bg-gray-100 rounded-md p-2 transition-all duration-200 ease-in-out"
      >
        Go home
      </p>
    </div>
  )
}

export default NotFound
