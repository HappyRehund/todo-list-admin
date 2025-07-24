// //src/components/tasks/update-task-dialog.tsx
// import { getAllUsers } from "@/app/data/user/get-all-users";
// import { UpdateTaskDialogClient } from "./update-task-dialog";

// interface UpdateTaskDialogProps {
//   task: {
//     id: string;
//     title: string;
//     description: string | null;
//     deadline: Date | null;
//     assignedTo: {
//       id: string;
//       name: string;
//       email: string;
//     };
//   };
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export async function UpdateTaskDialog({
//   task,
//   open,
//   onOpenChange,
// }: UpdateTaskDialogProps) {
//   const usersResult = await getAllUsers();
  
//   // Jika error atau tidak ada data, kirim array kosong
//   const users = usersResult.status === "OK" && usersResult.data ? usersResult.data : [];

//   return (
//     <UpdateTaskDialogClient 
//       task={task}
//       open={open}
//       onOpenChange={onOpenChange}
//       users={users}
//     />
//   );
// }