import { Input } from "/src/components/ui/Input"
import { useState } from "react"
import WantsSuggestions from "/src/components/WantsSuggestions"
import { Button } from "/src/components/ui/Button"
import { useAddWant } from "/src/hooks/userWantsHooks"
import { useTimedNotification } from "/src/contexts/NotificationContext"

const WantsForm = () => {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    image: "",
    author: "",
    isbn: "",
  })
  const { setTimedNotification } = useTimedNotification()
  const addWantMutation = useAddWant()

  const [suggestionsVisible, setSuggestionsVisible] = useState(false)
  const [wantFormVisible, setWantFormVisible] = useState(false)

  const handleQueryBlur = () => {
    setTimeout(() => setSuggestionsVisible(false), 50)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    const updatedFormState = { ...formState, [name]: value }
    setFormState(updatedFormState)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    console.log("Form submitted")
    const newWant = {
      title: formState.title,
      description: formState.description,
      image: formState.image,
      author: formState.author,
      isbn: formState.isbn,
    }
    try {
      addWantMutation.mutate(newWant)
      setWantFormVisible(false)
      // setTimedNotification("Want added", "success", 3000)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="w-9/10">
      <div className="relative">
        <Input
          type="text"
          name="title"
          placeholder="A book you want..."
          className={`col-span-8`}
          value={formState.title}
          onChange={handleFormChange}
          autoComplete="off"
          onFocus={() => setSuggestionsVisible(true)}
          onBlur={handleQueryBlur}
        />
        {suggestionsVisible && (
          <WantsSuggestions
            itemQuery={formState.title}
            formState={formState}
            setFormState={setFormState}
            setWantFormVisible={setWantFormVisible}
          />
        )}
      </div>
      {wantFormVisible ? (
        <form
          onSubmit={handleFormSubmit}
          className={`flex flex-row items-center justify-center m-auto h-full w-full mt-5 shadow-md border-1 border-gray-50 bg-white rounded-md`}
        >
          <div className="m-auto">
            <img className="h-full" src={formState.image} alt="" />
            <Button
              type="submit"
              className="bg-[var(--color-submit)] cursor-pointer m-2"
            >
              Add to Wants
            </Button>
          </div>
          <div className="flex flex-col h-70 p-2">
            <h1 className="text-2xl">{formState.title}</h1>
            <h2 className="text-lg italic text-gray-500">
              By: {formState.author}
            </h2>
            <h2>Description: </h2>
            <p className="h-max  overflow-y-auto border-1 border-[rgb(193,183,183)] p-2 rounded-md">
              {formState.description}
            </p>
          </div>
          <div className="col-span-6 flex flex-row justify-end"></div>
        </form>
      ) : null}
    </div>
  )
}

export default WantsForm
