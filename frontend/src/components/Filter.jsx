import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const Filter = () => {
  return (
    <div className="flex items-center">
      <h2 className="mr-2">Filters : </h2>
      <Input placeholder="Search" className="w-50" />

      <div className="flex items-center m-2">
        <Checkbox id="sold" />
        <label
          htmlFor="sold"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Sold
        </label>
      </div>
      <div className="flex items-center m-2">
        <Checkbox id="available" />
        <label
          htmlFor="available"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Available
        </label>
      </div>
      <div className="flex items-center m-2">
        <Checkbox id="books" />
        <label
          htmlFor="books"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Books
        </label>
      </div>
      <div className="flex items-center m-2">
        <Checkbox id="boardgames" />
        <label
          htmlFor="boardgames"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Boardgames
        </label>
      </div>
    </div>
  )
}

export default Filter
