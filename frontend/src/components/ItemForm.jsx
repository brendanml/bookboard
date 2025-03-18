import { useState, useEffect, useContext } from "react"
import { EntryContext } from "./EntryContext"
import { createListing } from "../services/listing"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"

const Entry = ({ entry, setEntries }) => {
  const [formState, setFormState] = useState({
    title: "",
    quantity: 1,
    price: 5.0, // Ensure value is a float
  })

  useEffect(() => {
    setFormState({
      title: entry.title || "",
      quantity: entry.quantity || "1",
      price: entry.price || "0",
    })
  }, [entry])

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    const removedDollar = value.replace("$", "")

    const updatedValue = parseFloat(removedDollar) || 0
    const updatedFormState = { ...formState, [name]: updatedValue }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  const handleTitleChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  const handleQuantityChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
    console.log("Updated form state:", updatedFormState)
  }

  return (
    <div className="grid space-x-4 rounded-sm border-2 border-gray-50 round p-2 my-2">
      <div className="grid grid-cols-13">
        <p className="col-span-6 text-left ml-1.5">Name</p>
        <p className="col-span-3 ml-2.5">Quantity</p>
        <p className="col-span-3 ml-3.5">Value</p>
      </div>
      <div className="grid grid-cols-13">
        <Input
          type="text"
          name="title"
          placeholder="Monopoly..."
          className="col-span-6"
          value={formState.title}
          onChange={handleTitleChange}
        />
        <Input
          type="number"
          name="quantity"
          className="col-span-3"
          value={formState.quantity}
          onChange={handleQuantityChange}
        />
        <Input
          type="text" // Use text type to allow formatting
          name="price"
          className="col-span-3"
          value={`$${formState.price}`}
          onChange={handlePriceChange}
        />
        <img
          className="w-8 m-auto cursor-pointer col-span-1"
          onClick={() => setEntries({ type: "REMOVE_ITEM", payload: entry.id })}
          src="/src/assets/exit.svg"
        />
      </div>
      <Textarea
        name="description"
        placeholder="description"
        onChange={handleDescriptionChange}
      />
    </div>
  )
}

const ItemForm = () => {
  const [entries, setEntries] = useContext(EntryContext)
  const [bookboardOption, setBookboardOption] = useState("boardgame-option")
  const navigate = useNavigate()

  const submitListing = async (e) => {
    e.preventDefault()
    console.log("Entries:", entries)
    const listings = { type: bookboardOption, entries: entries }
    createListing(listings)
    navigate("/listings")
  }

  return (
    <div className="w-2/5 flex flex-col justify-items-center align-middle m-auto">
      <h1>Create Listing</h1>
      <form onSubmit={submitListing}>
        <div className="flex gap-4">
          {["boardgame-option", "book-option"].map((option) => (
            <label
              key={option}
              htmlFor={option}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                id={option}
                type="radio"
                name="radio"
                value={option}
                checked={bookboardOption === option}
                onChange={() => setBookboardOption(option)} // ✅ Updates state on change
                className="hidden peer" // Hides default radio button
              />
              {/* Custom radio button UI */}
              {/* <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500"></div> */}
              {/* Label text */}
              <span className="text-gray-700 p-2 rounded-md peer-checked:bg-black peer-checked:text-white font-inter">
                {option === "boardgame-option" ? "Boardgame" : "Book"}
              </span>
            </label>
          ))}
        </div>
        {entries.map((entry) => (
          <Entry key={entry.id} entry={entry} setEntries={setEntries} />
        ))}
        <div className="flex justify-left items-center">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              setEntries({
                type: "ADD_ITEM",
                payload: {
                  id: Date.now(),
                  title: "",
                  quantity: 1,
                  value: 0,
                  description: "",
                },
              })
            }}
          >
            Add Entry
          </Button>
          <Button
            className="m-2 bg-[var(--primary-c)] cursor-pointer"
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ItemForm
