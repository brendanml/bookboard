import { getUserMatches } from "../services/user"
import { Button } from "/src/components/ui/Button"
import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import defaultAvatar from "/src/assets/default-avatar.png"
import Exchanges from "/src/components/Exchanges"
import CreateOfferPage from "@/pages/CreateOfferPage"
import { pageStyles, pageTitleStyles } from "@/utils/styles"
import { useState } from "react"

const Match = ({ match }) => {
  // const
  const [offerPageVisible, setOfferPageVisible] = useState(false)
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
        className="grid grid-cols-10 h-14 items-center border-gray-200 cursor-pointer hover:bg-gray-50 rounded-md"
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

  const handleCreateOffer = () => {
    setOfferPageVisible(true)
  }

  return (
    <div className="grid grid-cols-4 p-4 gap-2 border-1 rounded-md border-gray-300 m-auto mb-5 w-full">
      <div className="col-span-4 flex flex-row items-center mt-2 justify-between">
        <div className="flex flex-row items-center">
          <img src={defaultAvatar} alt="" className="w-10 rounded-full" />
          <h3 className="text-lg font-medium mx-2">
            {match.other_user.firstname} {match.other_user.lastname}
          </h3>
          <p>{match.other_user.location}</p>
        </div>
        <Button type="button" onClick={handleCreateOffer}>
          Create Offer
        </Button>
        {offerPageVisible && (
          <CreateOfferPage match={match} setVisibility={setOfferPageVisible} />
        )}
      </div>
      <div className="flex flex-col col-span-4">
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
      {/* <div className="col-span-4">{constructTradeValue()}</div> */}
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

  console.log("Matches data:", data)

  return data && data.length > 0
    ? data.map((match) => <Match key={match.match_id} match={match} />)
    : null
}

const MatchPage = () => {
  return (
    <div className="grid grid-cols-10 mt-4 bg-white w-[97%] m-auto mb-20 gap-4">
      {/* <Button className="cursor-pointer mt-4" onClick={handleMatchButton}>
        Click me
      </Button> */}
      <h1 className={`${pageTitleStyles} col-span-10`}>Exchanges</h1>
      <div className="col-span-6 flex flex-col h-screen">
        <h2 className="text-xl font-medium">Top Matches</h2>
        {/* <hr className="border-1/2 border-gray-300 mb-2" /> */}
        <Matches />
      </div>
      <div className="col-span-4 bg-white">
        <h2 className="text-xl font-medium">Exchanges</h2>
        <div className="border-1 border-gray-300 rounded-md z-10">
          <Exchanges />
        </div>
      </div>
    </div>
  )
}

export default MatchPage
