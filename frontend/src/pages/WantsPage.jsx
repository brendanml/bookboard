import WantsForm from "/src/components/forms/WantsForm.jsx"
import Wants from "/src/components/Wants"

const WantsPage = () => {
  return (
    <div className="p-4 w-full">
      <div className="flex flex-col">
        <h1 className="font-bold text-xl">Add a Book You Want</h1>
        <WantsForm />
        <h2>My Wants</h2>
        <Wants />
      </div>
    </div>
  )
}
export default WantsPage
