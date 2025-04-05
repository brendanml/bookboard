import { getUserMatches } from "../services/user"
import { Button } from "/src/components/ui/Button"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import defaultAvatar from "/src/assets/default-avatar.png"

const Match = ({ match }) => {
  // const
  const navigate = useNavigate()
  const handleListingClick = (listing_id) => {
    // console.log("Listing clicked:", listing_id)
    navigate(`/listings/${listing_id}`)
  }

  const calculatePriceDifference = () => {
    const your_value = match.your_haves
      ? match.your_haves.reduce((acc, entry) => {
          return acc + (entry.price || 0) // Ensure item.price exists
        }, 0)
      : 0

    const their_value = match.your_wants
      ? match.your_wants.reduce((acc, entry) => {
          return acc + (entry.price || 0) // Ensure item.price exists
        }, 0)
      : 0

    return your_value - their_value
  }
  const priceDifference = calculatePriceDifference()

  const createRow = (item, quantity, price, want_id) => {
    return (
      <div
        className="grid grid-cols-10 h-14 items-center border-gray-200 cursor-pointer hover:bg-gray-50"
        onClick={() => handleListingClick(want_id)}
      >
        <img src={item.image} alt="" className="h-10 col-span-1 m-auto" />
        <h2 className="truncate col-span-6">{item.title}</h2>
        <div className="col-span-3 flex flex-row justify-end">
          <p className="p-2">x{quantity}</p>
          <p className="p-2">CAD ${price}</p>
        </div>
      </div>
    )
  }

  const constructTradeValue = () => {
    if (priceDifference > 0) {
      return (
        <p className="text-lg">
          You're offering ${priceDifference} more than them.
        </p>
      )
    } else if (priceDifference < 0) {
      return (
        <p className="text-lg">
          They're offering ${-priceDifference} more value than you.
        </p>
      )
    } else {
      return <p className="text-lg">Trade value is equal.</p>
    }
  }

  return (
    <div className="grid grid-cols-4 p-4 gap-2 border-1 rounded-md border-gray-300 m-auto mb-5 w-4/7">
      <div className="flex flex-col col-span-3">
        {match.your_haves && match.your_haves.length > 0 && (
          <div className="mb-3">
            <h1 className="text-lg font-medium">They Want</h1>
            <div className="rounded-md border-gray-200 border-1">
              {match.your_haves.map((want) =>
                createRow(want.item, want.quantity, want.price, want._id),
              )}
            </div>
          </div>
        )}
        {match.your_wants && match.your_wants.length > 0 && (
          <div>
            <h1 className="text-lg font-medium">You Want</h1>
            <div className="rounded-md border-gray-200 border-1">
              {match.your_wants.map((want) =>
                createRow(want.item, want.quantity, want.price, want._id),
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center mt-2">
        <img src={defaultAvatar} alt="" className="w-32 rounded-full" />
        <p>
          {match.other_user.firstname} {match.other_user.lastname}
        </p>
        <p>{match.other_user.location}</p>
        <Button>Request to Match</Button>
      </div>
      <div className="col-span-4">{constructTradeValue()}</div>
    </div>
  )
}

const Matches = () => {
  // const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userMatches"],
    queryFn: getUserMatches,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error loading matches</div>
  }

  return data && data.length > 0
    ? data.map((match) => <Match key={match.match_id} match={match} />)
    : null
}

const MatchPage = () => {
  const handleMatchButton = async () => {
    // console.log("Match button clicked")
    const res = await getUserMatches()
    console.log(res)
  }
  return (
    <div className="p-2">
      {/* <Button className="cursor-pointer mt-4" onClick={handleMatchButton}>
        Click me
      </Button> */}
      <Matches />
    </div>
  )
}

export default MatchPage
