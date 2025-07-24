//src/app/data/task/get-all-tasks.ts
import "server-only";
import { prisma } from "@/lib/client/prisma";
import { getCurrentUser } from "../user/auth";

export async function getAllTasks() {
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

    return { success: true, data: tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks" };
  }
}
