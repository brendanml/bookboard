import { useQuery } from "@tanstack/react-query"
import { getItemSuggestions } from "../services/item"

const BooksDropdown = ({
  itemQuery,
  formState,
  setFormState,
  setEntries,
  entry,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["suggestions", itemQuery],
    queryFn: () =>
      getItemSuggestions({ type: "book-option", query: itemQuery }),
    enabled: !!itemQuery,
  })

  if (isLoading) {
    return (
      <div className="flex items-start border-1 border-gray-50 rounded p-2 h-auto cursor-pointer hover:bg-gray-100 max-h-72 overflow-y-auto absolute z-50 shadow-md bg-white w-full">
        Searching for "{formState.query}"...
      </div>
    )
  }
  if (isError) {
    return <div>Error</div>
  }

  const updateFormState = (item) => {
    const updatedFormState = {
      ...formState,
      title: item.title,
      image: item.thumbnail,
      isbn: item.isbn,
      author: item.author,
      itemDescription: item.description,
    }
    setFormState((prevState) => {
      const updatedFormState = {
        ...prevState,
        title: item.title,
        image: item.thumbnail,
        isbn: item.isbn,
        author: item.author,
        itemDescription: item.description,
      }
      return updatedFormState
    })

    setEntries({
      type: "UPDATE_ITEM",
      payload: { id: entry.id, ...updatedFormState },
    })
  }
  return (
    <div
      className={
        "flex flex-col max-h-72 overflow-y-auto absolute z-50 shadow-md bg-white w-full ml-2"
      }
    >
      {Array.isArray(data) &&
        data.map((item, index) => (
          <div
            className="flex items-start border-1 border-gray-50 rounded p-2 h-auto cursor-pointer hover:bg-gray-100"
            key={`${item.id}-${index}`}
            onClick={() => updateFormState(item)}
            onDoubleClick={() => updateFormState(item)}
            onMouseDown={() => updateFormState(item)}
          >
            <div className="flex-1 min-w-0">
              <h2 className="break-words">{item.title}</h2>
              <p className="italic text-gray-500 break-words">{item.author}</p>
            </div>
            <img
              className="w-auto h-10 ml-4 object-cover"
              src={item.thumbnail}
              alt=""
            />
          </div>
        ))}
    </div>
  )
}

export default BooksDropdown
