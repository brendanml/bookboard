import { getUserBooks } from "../services/user"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const UserBooks = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user"],
    queryFn: getUserBooks,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }
  if (isError) {
    return <div>Error</div>
  }

  return (
    <div>
      <h1>My Books</h1>
      <div className={"flex flex-row flex-wrap"}>
        {data.map((book) => (
          <Card key={book._id} className={"w-96"}>
            <CardHeader>
              <CardTitle>{book.item.title}</CardTitle>
              <CardDescription>{book.description}</CardDescription>
            </CardHeader>
            <CardContent>Price: ${book.price}</CardContent>
            <CardContent>Quantity: ${book.quantity}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default UserBooks
