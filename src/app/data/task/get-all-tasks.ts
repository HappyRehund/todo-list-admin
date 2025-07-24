//src/app/data/task/get-all-tasks.ts
import "server-only";
import { prisma } from "@/lib/client/prisma";
import { getCurrentUser } from "../user/auth";
import { TasksResponse } from "@/type/task";

export async function getAllTasks(): Promise<TasksResponse>{
  await getCurrentUser({ redirectIfNotFound: true });

  try {
    const tasks = await prisma.task.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { deadline: "asc" }, { createdAt: "desc" }],
    });

    return { status: "OK", data: tasks, message: "Find All User Tasks success" };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { status: "OK", message: "Failed to fetch tasks" };
  }
}
