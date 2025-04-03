import { useState } from "react"
import { useEffect, useRef } from "react"
import { Button } from "/src/components/ui/button"
import { Input } from "/src/components/ui/input"
import { Textarea } from "/src/components/ui/textarea"
import exit from "/src/assets/exit.svg"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const UserItemEdit = ({
  listing,
  setEditing,
  updateMutation,
  soldMutation,
}) => {
  const [formState, setFormState] = useState({
    quantity: listing.quantity,
    price: listing.price, // Ensure value is a float
    description: listing.description,
    status: listing.status,
    errors: {
      quantity: false,
      price: false,
    },
  })

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setEditing(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [setEditing])

  const handlePriceChange = (e) => {
    const { name, value } = e.target
    const removedDollar = value.replace("$", "")

    const updatedValue = parseFloat(removedDollar) || 0
    const updatedFormState = { ...formState, [name]: updatedValue }
    setFormState(updatedFormState)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
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

  const handleSubmit = async (e) => {
    // Handle form submission
    e.preventDefault()
    console.log("Form submitted", formState)
    try {
      updateMutation.mutate({
        bookId: listing._id,
        updates: {
          quantity: formState.quantity,
          price: formState.price,
          description: formState.description,
          status: formState.status,
        },
      })

      setEditing(false)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSold = async () => {
    // Handle sold button click
    console.log("Item sold")
    try {
      soldMutation.mutate(listing._id)
      setEditing(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="z-50 fixed inset-0 flex items-center justify-center bg-gray-200/70 overflow-auto">
      <form
        className="grid space-x-4 border-2 border-gray-50 round p-2 my-2 grid-cols-13 h-80 w-160 bg-white rounded-lg"
        onSubmit={(e) => handleSubmit(e)}
      >
        <img
          className="absolute top-10 right-5 w-5 cursor-pointer"
          src={exit}
          alt=""
          onClick={() => setEditing(false)}
        />
        <div className="col-span-13 flex justify-between mr-0">
          <div className="bg-gray-50 border-1 border-gray-100 rounded-md h-10 w-2/3 p-2 flex justify-between items-center overflow-hidden shadow-sm">
            <h2 className="italic">{listing.item.title}</h2>
          </div>
        </div>
        <div className="relative col-span-8">
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
          <p className="col-span-8">Price: </p>
          <Input
            type="text" // Use text type to allow formatting
            name="price"
            className={`col-span-8 ${formState.errors.price ? "border-red-500" : ""}`}
            value={`$${formState.price}`}
            onChange={handlePriceChange}
            onBlur={handlePriceBlur}
          />
          <Textarea
            name="description"
            placeholder="description"
            onChange={handleFormChange}
            value={formState.description}
          />
          <div className="col-span-13 flex justify-between w-full mt-2">
            <Button type="submit" className="cursor-pointer">
              Save Changes
            </Button>
            <Button
              className="bg-[var(--color-remove)] cursor-pointer"
              onClick={handleSold}
            >
              Mark Sold
            </Button>
            <Select
              value={formState.status}
              onValueChange={(value) =>
                setFormState({ ...formState, status: value })
              }
            >
              <SelectTrigger className="w-30">
                <SelectValue placeholder={formState.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">private</SelectItem>
                <SelectItem value="available">available</SelectItem>
                <SelectItem value="sold">sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-5 flex flex-col items-center justify-center m-auto h-full w-full">
          <img src={listing.item.image} alt="" />
        </div>
      </form>
    </div>
  )
}

export default UserItemEdit
