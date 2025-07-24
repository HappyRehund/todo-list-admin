//src/actions/auth/auth-action.ts
"use server";
import {
  comparePassword,
  generateSalt,
  hashPassword,
} from "@/lib/utils/auth-password";
import {
  createUserSession,
  removeUserFromSession,
} from "@/lib/session/auth-session";
import { prisma } from "@/lib/client/prisma";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  try {
    const { success, data, error } = signInSchema.safeParse(unsafeData);
    if (!success) {
      console.error("Validation error:", error);
      return {
        status: "ERR",
        message: "Failed to lewat zod",
      };
    }

    const user = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        salt: true,
        role: true,
      },
    });

    if (user == null || user.password == null || user.salt == null) {
      return {
        status: "ERR",
        message: "User not found or password not set",
      };
    }

    const isCorrectPassword = await comparePassword({
      hashedPassword: user.password,
      password: data.password,
      salt: user.salt,
    });

    if (!isCorrectPassword) {
      return {
        status: "ERR",
        message: "Invalid Email or password",
      };
    }

    const cookieStore = await cookies();
    await createUserSession(user, cookieStore);

    return {
      status: "OK",
      message: "User created successfully"
    }
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      status: "ERR",
      message: "An error occurred during sign in",
    };
  }

  // ga boleh redirect di server action
  // redirect("/");
}

export async function signUp(unsafeData: z.infer<typeof signUpSchema>) {
  try {
    const { success, data, error } = signUpSchema.safeParse(unsafeData);
    if (!success) {
      console.error("Validation error:", error);
      return "Invalid input data";
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (existingUser != null) {
      return "User already exists with this email";
    }

    // Generate salt and hash password
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return "Unable to create user";
    }

    // Create session
    const cookieStore = await cookies();
    await createUserSession(user, cookieStore);
  } catch (error) {
    console.error("Sign up error:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return "Email already exists";
      }
      if (error.message.includes("connect")) {
        return "Database connection error";
      }
    }

    return "Unable to create account. Please try again.";
  }

  redirect("/");
}

export async function logOut() {
  try {
    const cookieStore = await cookies();
    await removeUserFromSession(cookieStore);
  } catch (error) {
    console.error("Logout error:", error);
  }
  redirect("/");
}
