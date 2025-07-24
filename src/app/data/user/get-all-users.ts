//src/app/data/user/get-all-users.ts
import "server-only"
import { prisma } from "@/lib/client/prisma";
import { getCurrentUser } from "./auth";
import { UserRole } from "@/generated/prisma/enums";

interface ReturnAllUsers {
    id: string
    role: UserRole
    name: string
    email: string
}

interface GetAllUsersResponse {
  status: "OK" | "ERR";
  data?: ReturnAllUsers[];
  message: string
}
// Get all users buat dropdown assignment
export async function getAllUsers(): Promise<GetAllUsersResponse> {
  try {
    const user = await getCurrentUser({ redirectIfNotFound: true });

    if (user.role !== "admin") {
      return {
        status: "ERR",
        message: "Unauthorized",
      };
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      status: "OK",
      data: users,
      message: "Get All users success"
    };
  } catch (error) {
    console.error("Error getting data", error);
    return {
      status: "ERR",
      message: "Something happened when fetching the users data",
    };
  }
}