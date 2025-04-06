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
import exit from "/src/assets/exit.svg"
import fileUpload from "/src/assets/file_upload.svg"

const blankEntry = {
  query: "",
  title: "",
  quantity: 1,
  price: 5, // Ensure value is a float
  description: "",
  itemDescription: "",
  status: "available",
  author: "",
  isbn: "",
  image: "",
  errors: {
    title: false,
    quantity: false,
    price: false,
  },
}

const Entry = ({ entry, setEntries }) => {
  const [formState, setFormState] = useState(blankEntry)

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

  const handleQuantityChange = (type) => {
    let newValue =
      type == "increment" ? formState.quantity + 1 : formState.quantity - 1
    console.log("New value:", newValue)
    if (newValue < 1) {
      newValue = 1
    }
    const updatedFormState = {
      ...formState,
      quantity: newValue,
      errors: { ...formState.errors, quantity: false },
    }
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
      className={`rounded-sm border-2 border-gray-50 p-3 my-2 grid-cols-13 h-auto font-primary shadow-md w-120`}
    >
      <div className={`flex flex-row items-center h-10 justify-between grow`}>
        <div className="relative w-100">
          <Input
            type="text"
            name="query"
            placeholder="Add a book..."
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
        <div
          className="bg-gray-100 rounded-md p-3"
          onClick={() => setEntries({ type: "REMOVE_ITEM", payload: entry.id })}
        >
          <img className="w-3 cursor-pointer" src={exit} />
        </div>
      </div>

      <div className="flex flex-row">
        {formState.title !== "" && (
          <div className="h-80 w-auto p-3 pr-1.5">
            {formState.image === "" ? (
              <div className="border-2 border-dotted border-blue-100 h-full w-full flex items-center justify-center rounded-lg">
                <img className="w-8" src={fileUpload} alt="" />
              </div>
            ) : (
              <img
                src={formState.image}
                alt=""
                className="h-full w-auto max-w-none object-contain"
              />
            )}
          </div>
        )}
        {formState.title !== "" && (
          <div className="flex flex-col">
            <div className="w-full">
              <div className="m-3 pl-1.5 flex flex-col gap-y-4 w-48">
                <h2 className="font-bold">{formState.title}</h2>
                <div className="">
                  <p className="w-full">Quantity: </p>
                  <div className="flex flex-row items-center w-full">
                    <Button
                      type="button"
                      className="rounded-r-none cursor-pointer"
                      onClick={() => handleQuantityChange("decrement")}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      name="quantity"
                      className={`col-span-8 ${formState.errors.quantity ? "border-red-500" : ""} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border-0 border-y-1 shadow-none rounded-none text-center`}
                      value={formState.quantity}
                      onChange={handleFormChange}
                      min="1"
                    />
                    <Button
                      type="button"
                      className="rounded-l-none cursor-pointer"
                      onClick={() => handleQuantityChange("increment")}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="w-full">
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
                <div className="w-full">
                  <label htmlFor="status" className="col-span-8 mt-2">
                    Status:
                  </label>
                  <div className="flex flex-row space-between w-full">
                    <Button
                      type="button"
                      variant={
                        formState.status === "available" ? "" : "outline"
                      }
                      onClick={() => handleStatusChange("available")}
                      className={"cursor-pointer w-1/2"}
                    >
                      Available
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formState.status === "available" ? "outline" : ""
                      }
                      className={"cursor-pointer w-1/2"}
                      onClick={() => handleStatusChange("private")}
                    >
                      Private
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Textarea
              name="description"
              placeholder="description"
              onChange={handleFormChange}
              className="mt-2 w-full"
            />
          </div>
        )}
      </div>
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
    <div className="flex flex-col align-middle">
      <form onSubmit={submitListing} className="w-full">
        <div className="flex flex-row flex-wrap gap-6">
          {entries.map((entry) => (
            <Entry key={entry.id} entry={entry} setEntries={setEntries} />
          ))}
        </div>
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
                  ...blankEntry,
                },
              })
            }}
          >
            Add Another Book
          </Button>
          <Button
            className="m-2 bg-[var(--primary-c)] cursor-pointer shadow-md"
            type="submit"
          >
            Create Listings
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ItemForm

// <div className="flex gap-4">
// {["book-option"].map((option) => (
//   <label
//     key={option}
//     htmlFor={option}
//     className="flex items-center gap-2 cursor-pointer"
//   >
//     <input
//       id={option}
//       type="radio"
//       name="radio"
//       value={option}
//       checked={bookboardOption === option}
//       onChange={() => setBookboardOption(option)} // ✅ Updates state on change
//       className="hidden peer" // Hides default radio button
//     />
//     {/* Custom radio button UI */}
//     {/* <div className="w-5 h-5 border-2 border-gray-500 rounded-full flex items-center justify-center peer-checked:border-blue-500 peer-checked:bg-blue-500"></div> */}
//     {/* Label text */}
//     <span className="text-gray-700 p-2 rounded-md peer-checked:bg-black peer-checked:text-white font-inter">
//       {option === "boardgame-option" ? "Boardgame" : "Book"}
//     </span>
//   </label>
// ))}
// </div>
