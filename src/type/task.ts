import { Prisma } from "@/generated/prisma/client" 

export type Task = Prisma.TaskGetPayload<{
  include: {
    assignedTo: {
      select: {
        id: true
        name: true
        email: true
      }
    }
    createdBy: {
      select: {
        id: true
        name: true
        email: true
      }
    }
  }
}>
export interface TasksResponse{
  status: "OK" | "ERR",
  data?: Task[]
  message: string
}