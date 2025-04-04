import { User } from "lucide-react"
import ItemForm from "/src/components/forms/ItemForm"
import UserBooks from "/src/components/UserBooks"
import { pageStyles } from "@/utils/styles"

const AddListingPage = () => {
  return (
    <div className={`${pageStyles}`}>
      <ItemForm />
      <h1 className="font-bold text-2xl mt-4 text-center">
        Your Existing Listings
      </h1>
      <UserBooks />
      {/* Add your form or components here */}
    </div>
  )
}

export default AddListingPage
