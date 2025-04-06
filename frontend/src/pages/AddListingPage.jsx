import { User } from "lucide-react"
import ItemForm from "/src/components/forms/ItemForm"
import UserBooks from "/src/components/UserBooks"
import { pageStyles, pageTitleStyles } from "@/utils/styles"

const AddListingPage = () => {
  return (
    <div className={`${pageStyles}`}>
      <h1 className={`${pageTitleStyles}`}>Add Listings</h1>
      <ItemForm />
      <h1 className="text-xl mt-4">Your Existing Listings</h1>
      <hr className="border-1/2 border-gray-300 mb-2" />
      <UserBooks />
      {/* Add your form or components here */}
    </div>
  )
}

export default AddListingPage
