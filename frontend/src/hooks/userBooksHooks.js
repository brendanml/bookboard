import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import {
  deleteUserBook,
  updateUserListing,
  updateSoldListing,
  getUserBooks,
} from "../services/user" // Adjust the path as needed
import { useTimedNotification } from "../contexts/NotificationContext" // Adjust the path as needed

export const useDeleteMutation = () => {
  const { setTimedNotification } = useTimedNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookId) => deleteUserBook(bookId),
    onMutate: async (bookId) => {
      await queryClient.cancelQueries(["userBooks"])
      const previousBooks = queryClient.getQueryData(["userBooks"])

      queryClient.setQueryData(["userBooks"], (oldData) =>
        oldData.filter((listing) => listing._id !== bookId),
      )

      return { previousBooks }
    },
    onError: (err, bookId, context) => {
      queryClient.setQueryData(["userBooks"], context.previousBooks)
      setTimedNotification("Error deleting book", "error", 3000)
    },
    onSuccess: () => {
      setTimedNotification("Book deleted", "success", 3000)
    },
  })
}

export const useUpdateMutation = () => {
  const queryClient = useQueryClient()
  const { setTimedNotification } = useTimedNotification()

  return useMutation({
    mutationFn: ({ bookId, updates }) => updateUserListing(bookId, updates),
    onMutate: async ({ bookId, updates }) => {
      await queryClient.cancelQueries(["userBooks"])
      const previousBooks = queryClient.getQueryData(["userBooks"])

      queryClient.setQueryData(["userBooks"], (oldData) =>
        oldData.map((listing) =>
          listing._id === bookId ? { ...listing, ...updates } : listing,
        ),
      )

      return { previousBooks }
    },
    onError: (err, context) => {
      queryClient.setQueryData(["userBooks"], context.previousBooks)
      setTimedNotification("Error updating book", "error", 3000)
    },
    onSuccess: () => {
      setTimedNotification("Book updated", "success", 3000)
    },
  })
}

export const useSoldMutation = () => {
  const queryClient = useQueryClient()
  const { setTimedNotification } = useTimedNotification()

  return useMutation({
    mutationFn: (bookId) => updateSoldListing(bookId),
    onMutate: async (bookId) => {
      await queryClient.cancelQueries(["userBooks"])
      const previousBooks = queryClient.getQueryData(["userBooks"])

      queryClient.setQueryData(["userBooks"], (oldData) =>
        oldData.map((listing) =>
          listing._id === bookId ? { ...listing, status: "sold" } : listing,
        ),
      )

      return { previousBooks }
    },
    onError: (err, bookId, context) => {
      queryClient.setQueryData(["userBooks"], context.previousBooks)
      setTimedNotification("Error marking book as sold", "error", 3000)
    },
    onSuccess: () => {
      setTimedNotification("Book marked as sold", "success", 3000)
    },
  })
}

export const useUserBooksQuery = () => {
  return useQuery({
    queryKey: ["userBooks"],
    queryFn: getUserBooks,
  })
}
