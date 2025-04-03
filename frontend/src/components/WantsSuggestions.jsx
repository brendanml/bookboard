import { useQuery } from "@tanstack/react-query"
import { getItemSuggestions } from "../services/item"

const WantsSuggestions = ({
  itemQuery,
  formState,
  setFormState,
  setWantFormVisible,
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
        Searching for "{formState.title}"...
      </div>
    )
  }
  if (isError) {
    return <div>Error</div>
  }

  const updateFormState = (item) => {
    setFormState((prevState) => {
      const updatedFormState = {
        ...prevState,
        title: item.title,
        image: item.thumbnail,
        description: item.description,
        author: item.author,
        isbn: item.isbn,
      }
      setWantFormVisible(true)
      return updatedFormState
    })
  }
  return (
    <div
      className={
        "flex flex-col max-h-72 overflow-y-auto absolute z-50 shadow-md bg-white w-full"
      }
    >
      {Array.isArray(data)
        ? data.map((item, index) => (
            <div
              className="flex items-start border-1 border-gray-50 rounded p-2 h-auto cursor-pointer hover:bg-gray-100"
              key={index}
              onClick={() => updateFormState(item)}
              onDoubleClick={() => updateFormState(item)}
              onMouseDown={() => updateFormState(item)}
            >
              <img
                className="w-auto h-10 ml-2 mr-2 object-cover"
                src={item.thumbnail}
                alt=""
              />
              <div className="flex-1 min-w-0">
                <h2 className="break-words">{item.title}</h2>
                <p className="italic text-gray-500 break-words">
                  {item.author}
                </p>
              </div>
            </div>
          ))
        : null}
    </div>
  )
}

export default WantsSuggestions
