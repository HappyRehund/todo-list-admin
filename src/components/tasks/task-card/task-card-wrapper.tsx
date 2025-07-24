import { getAllUsers } from "@/app/data/user/get-all-users";
import { TaskCardClient } from "./task-card";
import { UserRole } from "@/generated/prisma/enums"; 


interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface TaskCardWrapperProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: "pending" | "completed";
    deadline: Date | null;
    createdAt: Date;
    assignedTo: {
      id: string;
      name: string;
      email: string;
    };
    createdBy: {
      id: string;
      name: string;
      email: string;
    };
  };
  currentUser: {
    id: string;
    role: "admin" | "user";
    name: string;
    email: string;
  };
}

export async function TaskCardWrapper({ task, currentUser }: TaskCardWrapperProps) {
  let users: User[] = [];
  
  // Hanya fetch users jika user adalah admin (yang bisa edit)
  if (currentUser.role === "admin") {
    const usersResult = await getAllUsers();
    users = usersResult.status === "OK" && usersResult.data ? usersResult.data : [];
  }

  return (
    <TaskCardClient 
      task={task} 
      currentUser={currentUser} 
      users={users}
    />
  );
}