import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CreateOfferPage = ({ match, setVisibility }) => {
  const [selectedListings, setSelectedListings] = useState({})
  const [priceDifference, setPriceDifference] = useState(0)
  const [compensation, setCompensation] = useState({ them: 0, you: 0 })
  const [tradeValue, setTradeValue] = useState(0)
  const [moneyBgColor, setMoneyBgColor] = useState("white")
  // const priceDifference = calculatePriceDifference()

  useEffect(() => {
    const calculatePriceDifference = (selectedIds) => {
      const your_value = match.your_haves
        ? match.your_haves
            .filter((listing) => selectedIds.includes(listing._id))
            .reduce((acc, entry) => {
              return acc + (entry.price || 0) // Ensure item.price exists
            }, 0)
        : 0

      const their_value = match.your_wants
        ? match.your_wants
            .filter((listing) => selectedIds.includes(listing._id))
            .reduce((acc, entry) => {
              return acc + (entry.price || 0) // Ensure item.price exists
            }, 0)
        : 0

      return your_value - their_value
    }
    const selectedIds = Object.keys(selectedListings).filter(
      (listing_id) => selectedListings[listing_id],
    )
    const newPriceDifference = calculatePriceDifference(selectedIds)
    setPriceDifference(newPriceDifference)
    if (newPriceDifference <= 0) {
      setCompensation({ them: 0, you: -newPriceDifference })
    } else {
      setCompensation({ them: newPriceDifference, you: 0 })
    }
  }, [selectedListings, match])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setVisibility(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  console.log("Price difference:", priceDifference)

  const handleListingClick = (listing_id) => {
    console.log("Listing clicked:", listing_id)
    const newSelectedListings = {
      ...selectedListings,
      [listing_id]: !selectedListings[listing_id],
    }
    setSelectedListings(newSelectedListings)
    setTradeValue(0)
    console.log("Selected listings:", newSelectedListings)
  }

  const handleCompensationChange = (e, person) => {
    const newCompensation = e.target.value
    const updatedPerson = { [person]: newCompensation }
    const updatedCompensation = {
      ...compensation,
      ...updatedPerson,
    }
    console.log("Compensation changed:", newCompensation)
    setCompensation(updatedCompensation)
    if (person === "them") {
      setTradeValue(
        priceDifference + parseInt(newCompensation) - compensation["you"],
      )
    } else {
      setTradeValue(
        priceDifference - parseInt(newCompensation) + compensation["them"],
      )
    }
    console.log("Updated compensation:", updatedCompensation)
  }

  const createOfferMessage = () => {
    // const newTradeValue =
    //   priceDifference + compensation["you"] - compensation["them"]
    if (tradeValue === 0) {
      return "Trade value is equal."
    } else if (tradeValue > 0) {
      return `You're offering $${tradeValue} more than them.`
    } else if (tradeValue < 0) {
      // priceDifference < 0
      return `They're offering $${-tradeValue} more value than you.`
    }
  }

  const moneyRow = (person) => {
    return (
      <div>
        <div
          className={`flex flex-row items-center justify-between p-2 border-t-1 border-gray-200 ${moneyBgColor}`}
        >
          <span className="text-lg font-medium">Money</span>
          <div className="flex flex-row items-center relative h-9 w-20 bg-white rounded-md">
            <div className="h-full w-8 bg-black absolute rounded-l-md text-white flex items-center justify-center font-medium text-md">
              $
            </div>
            <Input
              value={compensation[person]}
              type="number"
              className="text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              onChange={(e) => handleCompensationChange(e, person)}
              inputMode="numeric"
            />
          </div>
        </div>
      </div>
    )
  }

  const createRow = (item, quantity, price, listing_id) => {
    return (
      <div
        key={listing_id}
        className={`grid grid-cols-10 h-14 items-center  border-gray-200 cursor-pointer hover:bg-blue-100/50 ${selectedListings[listing_id] ? "bg-blue-50/50" : ""}`}
        onClick={() => handleListingClick(listing_id)}
      >
        <img src={item.image} alt="" className="h-10 col-span-1 m-auto" />
        <h2 className="truncate col-span-6">{item.title}</h2>
        <div className="col-span-3 flex flex-row justify-end mr-3 items-center">
          <p className="p-2">x{quantity}</p>
          <p className="p-2">CAD ${price}</p>
          <Checkbox checked={selectedListings[listing_id]} />
        </div>
      </div>
    )
  }
  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-gray-200/70">
      <div className="border-2 border-gray-50 round p-2 my-2 grid-cols-13 w-[60%] bg-white rounded-lg flex flex-col gap-y-3 max-h-[80vh]">
        <h2 className="text-xl font-medium mb-3">
          Select Listings to Exchange
        </h2>
        <div className="flex flex-col col-span-4">
          {match.your_haves && match.your_haves.length > 0 && (
            <div className="mb-3">
              <h1 className="text-lg">You Offer</h1>
              <div className="rounded-md border-gray-200 border-1">
                {match.your_haves.map((listing) =>
                  createRow(
                    listing.item,
                    listing.quantity,
                    listing.price,
                    listing._id,
                  ),
                )}
                {moneyRow("you")}
              </div>
            </div>
          )}
          {match.your_wants && match.your_wants.length > 0 && (
            <div>
              <h1 className="text-lg">They Offer</h1>
              <div className="rounded-md border-gray-200 border-1">
                {match.your_wants.map((listing) =>
                  createRow(
                    listing.item,
                    listing.quantity,
                    listing.price,
                    listing._id,
                  ),
                )}
                {moneyRow("them")}
              </div>
            </div>
          )}
        </div>
        <div
          className={`w-full flex items-center ${tradeValue === 0 ? "bg-green-200/50" : "bg-red-300/50"} rounded-md px-2 py-3 h-10`}
        >
          <h2 className="text-md">{createOfferMessage()}</h2>
        </div>
        <Textarea
          name="message"
          placeholder="message..."
          className="w-full mt-2"
        />
        <Button>Send Offer</Button>
      </div>
    </div>
  )
}
export default CreateOfferPage
