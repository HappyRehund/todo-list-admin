import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminPage() {

  // kita bisa render data pake server
  // const data = await getDataFromServer();

  // pake useTransition (const [isPending, startTransition] = useTransition())
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-8">Admin</h1>
      <Button asChild>
        <Link href="/">Home</Link>
      </Button>
    </div>
  )
}