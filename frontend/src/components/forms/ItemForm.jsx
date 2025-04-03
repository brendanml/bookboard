import { useState, useContext } from "react"
import { EntryContext } from "../../contexts/EntryContext"
import { createUserListing } from "../../services/user"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import BooksDropdown from "../BooksDropdown"
import { useTimedNotification } from "../../contexts/NotificationContext"
import { Label } from "/src/components/ui/label"

const Entry = ({ entry, setEntries }) => {
  const [formState, setFormState] = useState({
    query: "",
    title: "",
    quantity: 1,
    price: 5, // Ensure value is a float
    description: "",
    itemDescription: "",
    status: "available",
    isbn: "",
    image: "",
    errors: {
      title: false,
      quantity: false,
      price: false,
    },
  })

  const [suggestionsVisible, setSuggestionsVisible] = useState(false)

  const handleTitleChange = () => {
    console.log("Title change:", formState.title)
  }

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    const removedDollar = value.replace("$", "")

    const updatedValue = parseFloat(removedDollar) || 0
    const updatedFormState = {
      ...formState,
      [name]: updatedValue,
      errors: { ...formState.errors, price: false },
    }
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    console.log(formState.status)
    setFormState(updatedFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }

  const handlePriceBlur = () => {
    if (formState.price > 100) {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, price: true },
      }))
    } else {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, price: false },
      }))
    }
  }

  const handleQueryBlur = () => {
    setTimeout(() => setSuggestionsVisible(false), 50)
    if (formState.title === "") {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, title: true },
      }))
    } else {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, title: false },
      }))
    }
  }
  const handleQuantityBlur = () => {
    if (formState.quantity < 1) {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, quantity: true },
      }))
    } else {
      setFormState((prevState) => ({
        ...prevState,
        errors: { ...prevState.errors, quantity: false },
      }))
    }
  }

  const handleStatusChange = (status) => {
    const newFormState = {
      ...formState,
      status: status,
    }
    setFormState(newFormState)
    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...newFormState },
    })
  }

  return (
    <div
      className={`grid space-x-4 rounded-sm border-2 border-gray-50 round p-2 my-2 grid-cols-13 h-auto w-160 font-primary shadow-md`}
    >
      <div
        className={`col-span-13 flex flex-row items-center h-10 justify-between`}
      >
        <div className="relative w-9/10">
          <Input
            type="text"
            name="query"
            placeholder="Search..."
            className={`${formState.errors.title ? "border-red-500" : ""} mx-2`}
            value={formState.query}
            onChange={handleFormChange}
            autoComplete="off"
            onFocus={() => setSuggestionsVisible(true)}
            onBlur={handleQueryBlur}
          />
          {suggestionsVisible && (
            <BooksDropdown
              entry={entry}
              setEntries={setEntries}
              itemQuery={formState.query}
              formState={formState}
              setFormState={setFormState}
              handleTitleChange={handleTitleChange}
            />
          )}
        </div>
        <img
          className="w-3 cursor-pointer"
          onClick={() => setEntries({ type: "REMOVE_ITEM", payload: entry.id })}
          src="/src/assets/exit.svg"
        />
      </div>
      {formState.title !== "" && (
        <div className="col-span-4 flex flex-col h-full w-auto p-3 pr-1.5">
          {formState.image === "" ? (
            <div className="border-2 border-dotted border-blue-100 h-full w-full flex items-center justify-center rounded-lg">
              <img className="w-8" src="/src/assets/file_upload.svg" alt="" />
            </div>
          ) : (
            <img src={formState.image} alt="" className="h-full w-fit" />
          )}
        </div>
      )}
      {formState.title !== "" && (
        <div className="col-span-9 m-3 pl-1.5">
          <h2 className="font-bold">{formState.title}</h2>
          <div className="mt-2">
            <p className="col-span-8">Quantity: </p>
            <Input
              type="number"
              name="quantity"
              className={`col-span-8 ${formState.errors.quantity ? "border-red-500" : ""}`}
              value={formState.quantity}
              onChange={handleFormChange}
              min="1"
              onBlur={handleQuantityBlur}
            />
          </div>
          <div className="mt-2">
            <p className="col-span-8">Price: </p>
            <Input
              type="text" // Use text type to allow formatting
              name="price"
              className={`col-span-8 ${formState.errors.price ? "border-red-500" : ""}`}
              value={`$${formState.price}`}
              onChange={handlePriceChange}
              onBlur={handlePriceBlur}
            />
          </div>
          <div className="flex flex-row space-between mt-2">
            <div
              onClick={() => handleStatusChange("available")}
              className={`text-center w-4/5 text-sm rounded-md p-1 cursor-pointer border-1 border-black ${formState.status === "available" ? "bg-black text-white" : ""}`}
            >
              Available
            </div>
            <div
              className={`text-center w-4/5 text-sm rounded-md p-1 cursor-pointer border-1 border-black ${formState.status === "private" ? "bg-black text-white" : ""}`}
              onClick={() => handleStatusChange("private")}
            >
              Private
            </div>
          </div>
          <Textarea
            name="description"
            placeholder="description"
            onChange={handleFormChange}
            className="mt-2"
          />
        </div>
      )}
    </div>
  )
}

const ItemForm = () => {
  const [entries, setEntries] = useContext(EntryContext)
  const [bookboardOption, setBookboardOption] = useState("book-option")
  const navigate = useNavigate()
  const { setTimedNotification } = useTimedNotification()

  //change default back to boardgame-option
  const submitListing = async (e) => {
    console.log("Entries:", entries)
    e.preventDefault()

    const listings = { type: bookboardOption, entries: entries }
    // for (const entry of entries) {
    //   if (entry.errors.title || entry.errors.quantity || entry.errors.price) {
    //     console.log("errors: ", entry.errors)
    //     setTimedNotification(
    //       "Please fix all errors before submitting",
    //       "error",
    //       3000,
    //     )
    //     return
    //   }
    // }
    try {
      const createdListings = await createUserListing(listings)
      console.log(createdListings)
      setTimedNotification("Listing created successfully", "success", 3000)
      navigate("/home")
    } catch (e) {
      console.error(e)
      setTimedNotification("Failed to create listing", "error", 3000)
    }
  }

  return (
    <div className="w-140 flex flex-col items-center align-middle m-auto">
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
                  quantity: 1,
                  price: 5.0,
                  isbn: "",
                  description: "",
                  status: "available",
                  image: "",
                  errors: {
                    title: false,
                    quantity: false,
                    price: false,
                  },
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
