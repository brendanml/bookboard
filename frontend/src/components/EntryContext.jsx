import { createContext, useReducer } from "react"

const entryReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const newEntry = {
        id: Date.now(),
        title: action.payload.title,
        quantity: action.payload.quantity,
        price: action.payload.price,
        description: action.payload.description,
      }
      return [...state, newEntry]
    }
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload)
    case "UPDATE_ITEM": {
      const updatedEntry = {
        id: action.payload.id,
        title: action.payload.title,
        quantity: action.payload.quantity,
        price: action.payload.price,
        description: action.payload.description,
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
    { id: 1, title: "", quantity: "1", price: "0", description: "" },
  ])
  return (
    <EntryContext.Provider value={[entries, setEntries]}>
      {props.children}
    </EntryContext.Provider>
  )
}

export { EntryContext }
