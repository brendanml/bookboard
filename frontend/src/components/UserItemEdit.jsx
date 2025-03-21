// import { useState } from "react"

// const UserEditItem = () => {
//     const [formState, setFormState] = useState({
//       query: "",
//       title: "",
//       quantity: 1,
//       price: 5.0, // Ensure value is a float
//       description: "",
//       image: "",
//     })
//     const [suggestionsVisible, setSuggestionsVisible] = useState(false)

//     const handleTitleChange = () => {
//       console.log("Title change:", formState.title)
//     }

//     const handlePriceChange = (e) => {
//       const { name, value } = e.target
//       const removedDollar = value.replace("$", "")

//       const updatedValue = parseFloat(removedDollar) || 0
//       const updatedFormState = { ...formState, [name]: updatedValue }
//       setFormState(updatedFormState)
//     }

//     const handleFormChange = (e) => {
//       const { name, value } = e.target
//       const updatedFormState = { ...formState, [name]: value }
//       setFormState(updatedFormState)
//     }

//     return (
//       <div className="grid space-x-4 rounded-sm border-2 border-gray-50 round p-2 my-2 grid-cols-13">
//         <div className="col-span-13 flex justify-between mr-0">
//           <p>Search</p>
//           <div className="col-span-6 flex justify-between">
//             <h2>{formState.title}</h2>
//             <img
//               className="w-8 cursor-pointer col-span-1"
//               onClick={() =>
//                 setEntries({ type: "REMOVE_ITEM", payload: entry.id })
//               }
//               src="/src/assets/exit.svg"
//             />
//           </div>
//         </div>
//         <div className="relative col-span-8">
//           <p className="col-span-8">Quantity: </p>
//           <Input
//             type="number"
//             name="quantity"
//             className=""
//             value={formState.quantity}
//             onChange={handleFormChange}
//           />
//           <p className="col-span-8">Price: </p>
//           <Input
//             type="text" // Use text type to allow formatting
//             name="price"
//             className="col-span-8"
//             value={`$${formState.price}`}
//             onChange={handlePriceChange}
//           />
//           <Textarea
//             name="description"
//             placeholder="description"
//             onChange={handleFormChange}
//           />
//         </div>
//         <div className="col-span-5 flex flex-col items-center justify-center m-auto">
//           <img src={formState.image} alt="" />
//         </div>
//       </div>
//     )
//   }
// }

// export default UserEditItem
