import "./App.css"
import "./index.css"

import { Routes, Route } from "react-router-dom"
import { EntryContextProvider } from "./components/EntryContext"

import Home from "./components/Home.jsx"
import ItemForm from "./components/ItemForm.jsx"
import Header from "./components/Header.jsx"
import Register from "./components/Register.jsx"
import Login from "./components/Login.jsx"
import Notification from "./components/Notification.jsx"
import Account from "./components/Account.jsx"
import Listings from "./components/Listings.jsx"
import UserItems from "./components/UserItems"

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/listings/create"
          element={
            <EntryContextProvider>
              <ItemForm />
            </EntryContextProvider>
          }
        />
        <Route path="/user/items" element={<UserItems />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Notification />
    </>
  )
}

export default App
