import "./App.css"
import "./index.css"

import { Routes, Route, useLocation } from "react-router-dom"
import { EntryContextProvider } from "./contexts/EntryContext"

import HomePage from "/src/pages/HomePage.jsx"
import ItemForm from "/src/components/forms/ItemForm.jsx"
import Header from "./components/Header.jsx"
import AccountPage from "/src/pages/AccountPage.jsx"
import MatchPage from "./pages/MatchPage.jsx"
import UserItems from "./components/UserItems"
import WantsPage from "/src/pages/WantsPage.jsx"
import Footer from "./components/Footer"
import LandingPage from "/src/pages/LandingPage"
import NotFoundPage from "/src/pages/NotFoundPage.jsx"
import ItemPage from "/src/pages/ItemPage.jsx"
import ListingPage from "./pages/ListingPage"
import AddListingPage from "./pages/AddListingPage"

function App() {
  const hidePaths = ["/"]
  const location = useLocation()
  return (
    <div className="font-primary min-h-screen flex flex-col">
      {!hidePaths.includes(location.pathname) && (
        <>
          <Header />
        </>
      )}
      <div className={`flex-grow ${location.pathname === "/" ? "" : "mt-14"}`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/listings/create"
            element={
              <EntryContextProvider>
                <AddListingPage />
              </EntryContextProvider>
            }
          />
          <Route path="/wants/create" element={<WantsPage />} />
          <Route path="/user/items" element={<UserItems />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/books/:id" element={<ItemPage />} />
          <Route path="/listings/:id" element={<ListingPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      {!hidePaths.includes(location.pathname) && <Footer />}
    </div>
  )
}

export default App
