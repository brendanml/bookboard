import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { deleteWant, getUserWants, addWant } from "../services/user" // Adjust the path as needed
import { useTimedNotification } from "../contexts/NotificationContext" // Adjust the path as needed

export const useUserWants = () => {
  return useQuery({
    queryKey: ["userWants"],
    queryFn: getUserWants,
  })
}

export const useDeleteWant = () => {
  const { setTimedNotification } = useTimedNotification()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (wantId) => deleteWant(wantId),
    onMutate: async (wantId) => {
      await queryClient.cancelQueries(["userWants"])
      const previousWants = queryClient.getQueryData(["userWants"])

      queryClient.setQueryData(["userWants"], (oldData) =>
        oldData.filter((want) => want._id !== wantId),
      )

      return { previousWants }
    },
    onError: (err, wantId, context) => {
      queryClient.setQueryData(["userWants"], context.previousWants)
      setTimedNotification("Error deleting want", "error", 3000)
    },
    onSuccess: () => {
      setTimedNotification("Want deleted", "success", 3000)
    },
  })
}

export const useAddWant = () => {
  const queryClient = useQueryClient()
  const { setTimedNotification } = useTimedNotification()

  return useMutation({
    mutationFn: (want) => addWant(want),
    onMutate: async () => {
      await queryClient.cancelQueries(["userWants"])
    },
    onError: () => {
      setTimedNotification("Error updating book", "error", 3000)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userWants"]) // Refetch the data from the server
      setTimedNotification("Book updated", "success", 3000)
    },
  })
}
