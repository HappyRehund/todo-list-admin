//src/components/tasks/create-task-dialog.tsx
import { getAllUsers } from "@/app/data/user/get-all-users";
import { CreateTaskDialogContent } from "./create-task-dialog"; 

interface CreateTaskDialogProps {
  children: React.ReactNode;
}

export async function CreateTaskDialog({ children }: CreateTaskDialogProps) {
  const usersResult = await getAllUsers();
  
  // Jika error atau tidak ada data, kirim array kosong
  const users = usersResult.status === "OK" && usersResult.data ? usersResult.data : [];

  return (
    <CreateTaskDialogContent users={users}>
      {children}
    </CreateTaskDialogContent>
  );
}