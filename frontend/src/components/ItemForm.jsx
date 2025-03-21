import { useState, useEffect, useContext } from "react"
import { EntryContext } from "./EntryContext"
import { createListing } from "../services/listing"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import ItemSuggestions from "./ItemSuggestions"

const Entry = ({ entry, setEntries }) => {
  const [formState, setFormState] = useState({
    query: "",
    title: "",
    quantity: 1,
    price: 5.0, // Ensure value is a float
    description: "",
    image: "",
  })
  const [suggestionsVisible, setSuggestionsVisible] = useState(false)

  const handleTitleChange = () => {
    console.log("Title change:", formState.title)
  }

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

  const handleFormChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  return (
    <div className="grid space-x-4 rounded-sm border-2 border-gray-50 round p-2 my-2 grid-cols-13">
      <div className="col-span-13 flex justify-between mr-0">
        <p>Search</p>
        <div className="col-span-6 flex justify-between">
          <h2>{formState.title}</h2>
          <img
            className="w-8 cursor-pointer col-span-1"
            onClick={() =>
              setEntries({ type: "REMOVE_ITEM", payload: entry.id })
            }
            src="/src/assets/exit.svg"
          />
        </div>
      </div>
      <div className="relative col-span-8">
        <Input
          type="text"
          name="query"
          placeholder="Monopoly..."
          className="col-span-6"
          value={formState.query}
          onChange={handleFormChange}
          autoComplete="off"
          onFocus={() => setSuggestionsVisible(true)}
          onBlur={() => setTimeout(() => setSuggestionsVisible(false), 200)}
        />
        {suggestionsVisible && (
          <ItemSuggestions
            entry={entry}
            setEntries={setEntries}
            itemQuery={formState.query}
            formState={formState}
            setFormState={setFormState}
            handleTitleChange={handleTitleChange}
          />
        )}
        <p className="col-span-8">Quantity: </p>
        <Input
          type="number"
          name="quantity"
          className=""
          value={formState.quantity}
          onChange={handleFormChange}
        />
        <p className="col-span-8">Price: </p>
        <Input
          type="text" // Use text type to allow formatting
          name="price"
          className="col-span-8"
          value={`$${formState.price}`}
          onChange={handlePriceChange}
        />
        <Textarea
          name="description"
          placeholder="description"
          onChange={handleFormChange}
        />
      </div>
      <div className="col-span-5 flex flex-col items-center justify-center m-auto">
        <img src={formState.image} alt="" />
      </div>
    </div>
  )
}

const ItemForm = () => {
  const [entries, setEntries] = useContext(EntryContext)
  const [bookboardOption, setBookboardOption] = useState("book-option")
  const navigate = useNavigate()

  //change default back to boardgame-option

  const submitListing = async (e) => {
    e.preventDefault()
    console.log("Entries:", entries)
    const listings = { type: bookboardOption, entries: entries }
    createListing(listings)
    navigate("/listings")
  }

  return (
    <div className="w-140 flex flex-col items-center align-middle m-auto">
      <h1>Create Listing</h1>
      <form onSubmit={submitListing}>
        <div className="flex gap-4">
          {["book-option"].map((option) => (
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
                  query: "",
                  title: "",
                  quantity: "1",
                  price: 5.0,
                  description: "",
                  image: "",
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
