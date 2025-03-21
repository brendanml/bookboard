import { useQuery } from "@tanstack/react-query"
import { getItemSuggestions } from "../services/item"

const ItemSuggestions = ({
  itemQuery,
  formState,
  setFormState,
  setEntries,
  entry,
  handleTitleChange,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["suggestions", itemQuery],
    queryFn: () =>
      getItemSuggestions({ type: "book-option", query: itemQuery }),
    enabled: !!itemQuery,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  const updateFormState = (item) => {
    const updatedFormState = {
      ...formState,
      title: item.title,
      image: item.thumbnail,
    }
    setFormState((prevState) => {
      const updatedFormState = {
        ...prevState,
        title: item.title,
        image: item.thumbnail,
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
        "flex flex-col max-h-72 overflow-y-auto absolute z-50 shadow-md bg-white w-full"
      }
    >
      {data
        ? data.map((item, index) => (
            <div
              className="flex items-start border-2 border-gray-50 rounded p-2 my-1 h-auto cursor-pointer hover:bg-gray-100"
              key={item.id}
              onClick={() => updateFormState(item)}
              onDoubleClick={() => updateFormState(item)}
              onMouseDown={() => updateFormState(item)}
            >
              <div className="flex-1 min-w-0">
                <h2 className="break-words">{item.title}</h2>
                <p className="italic text-gray-500 break-words">
                  {item.author}
                </p>
              </div>
              <img
                className="w-auto h-10 ml-4 object-cover"
                src={item.thumbnail}
                alt=""
              />
            </div>
          ))
        : null}
    </div>
  )
}

export default ItemSuggestions
