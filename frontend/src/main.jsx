import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router-dom"
import App from "./App"
import { NotificationProvider } from "./components/NotificationContext"
import { UserContextProvider } from "./components/UserContext"
import { StrictMode } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <NotificationProvider>
          <Router>
            <App />
          </Router>
        </NotificationProvider>
      </UserContextProvider>
    </QueryClientProvider>
  </StrictMode>,
)
