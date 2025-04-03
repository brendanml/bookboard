import { createContext, useReducer } from "react"

const entryReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const newEntry = {
        ...action.payload,
      }
      return [...state, newEntry]
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload)
    case "UPDATE_ITEM": {
      const updatedEntry = {
        ...action.payload,
      }
      return state.map((entry) =>
        entry.id === action.payload.id ? updatedEntry : entry,
      )
    }
    default:
      return state
  }
}

const EntryContext = createContext()

export const EntryContextProvider = (props) => {
  const [entries, setEntries] = useReducer(entryReducer, [
    {
      id: Date.now(),
      title: "",
      quantity: "1",
      price: "0",
      description: "",
      image: "",
      isbn: "",
      errors: { title: false, quantity: false, price: false },
    },
  ])
  return (
    <EntryContext.Provider value={[entries, setEntries]}>
      {props.children}
    </EntryContext.Provider>
  )
}

export { EntryContext }
