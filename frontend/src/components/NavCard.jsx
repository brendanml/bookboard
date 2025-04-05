import { useNavigate } from "react-router-dom"

const NavCard = ({ item, itemType, size }) => {
  const navigate = useNavigate()
  const handleClick = (item) => {
    navigate(`/${itemType}/${item._id}`)
  }
  return (
    <div
      className="cursor-pointer mr-2"
      key={item._id}
      onClick={() => handleClick(item)}
    >
      <img
        className={`${size || "h-40"} rounded-sm border-1 border-gray-50 shadow-md  object-contain w-auto`}
        src={item.image}
        alt={item.title}
      />
    </div>
  )
}
export default NavCard
