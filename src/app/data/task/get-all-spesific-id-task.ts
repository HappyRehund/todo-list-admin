//src/app/data/task/get-all-spesific-id-task.ts
import "server-only";
import { prisma } from "@/lib/client/prisma";
import { getCurrentUser } from "../user/auth";
import { TasksResponse } from "@/type/task";

export async function getMyTasks(): Promise<TasksResponse> {
  const user = await getCurrentUser({ redirectIfNotFound: true });
  
  try {
    const tasks = await prisma.task.findMany({
      where: {
        assignedToId: user.id,
      },
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

    return { status: "OK", data: tasks, message: "Find All Tasks Success" };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { status: "ERR", message: "Failed to fetch tasks" };
  }
}
