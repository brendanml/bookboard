import WantsForm from "/src/components/forms/WantsForm.jsx"
import Wants from "/src/components/Wants"
import { pageStyles, pageTitleStyles } from "@/utils/styles"

const WantsPage = () => {
  return (
    <div className={pageStyles}>
      <div className="flex flex-col">
        <h1 className={pageTitleStyles}>Add Want</h1>
        <WantsForm />
        <h2 className="text-xl">My Wants</h2>
        <hr className="border-1/2 border-gray-300 mb-2" />
        <Wants />
      </div>
    </div>
  )
}
export default WantsPage
