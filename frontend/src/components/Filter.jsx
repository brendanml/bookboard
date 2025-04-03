import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const Filter = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value })
  }

  const handleCheckboxChange = (filterName) => (checked) => {
    onFilterChange({ ...filters, [filterName]: checked })
  }

  return (
    <div className="flex flex-wrap items-center">
      <h2 className="mr-2">Filters:</h2>
      <Input
        placeholder="Search"
        className="w-52"
        value={filters.search}
        onChange={handleSearchChange}
      />
      <div className="flex items-center m-2">
        <Checkbox
          id="sold"
          checked={filters.showSold}
          onCheckedChange={handleCheckboxChange("showSold")}
        />
        <label
          htmlFor="sold"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Sold
        </label>
      </div>
      <div className="flex items-center m-2">
        <Checkbox
          id="available"
          checked={filters.showAvailable}
          onCheckedChange={handleCheckboxChange("showAvailable")}
        />
        <label
          htmlFor="available"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Available
        </label>
      </div>
      {/* <div className="flex items-center m-2">
        <Checkbox
          id="books"
          checked={filters.showBooks}
          onCheckedChange={handleCheckboxChange("showBooks")}
        />
        <label
          htmlFor="books"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Books
        </label>
      </div>
      <div className="flex items-center m-2">
        <Checkbox
          id="boardgames"
          checked={filters.showBoardgames}
          onCheckedChange={handleCheckboxChange("showBoardgames")}
        />
        <label
          htmlFor="boardgames"
          className="text-sm font-medium p-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show Boardgames
        </label>
      </div> */}
    </div>
  )
}

export default Filter
