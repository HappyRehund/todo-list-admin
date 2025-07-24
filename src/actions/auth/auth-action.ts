// actions/auth/auth-action.ts
"use server"

import {
  comparePassword,
  generateSalt,
  hashPassword,
} from "@/lib/utils/auth-password";
import { createUserSession, removeUserFromSession } from "@/lib/session/auth-session";
import { prisma } from "@/lib/client/prisma";
import { signInSchema, signUpSchema } from "@/schemas/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function signIn(unsafeData: z.infer<typeof signInSchema>) {
  const { success, data } = signInSchema.safeParse(unsafeData);

  if (!success) {
    return "Invalid input data";
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
    return "User not found or password not set";
  }

  const isCorrectPassword = await comparePassword({
    hashedPassword: user.password, //pw yang ada di db
    password: data.password, //pw yang datang
    salt: user.salt,
  });

  if (!isCorrectPassword) return "Unable to log you in";

  await createUserSession(user, await cookies());

  redirect("/");
}

export async function signUp(unsafeDate: z.infer<typeof signUpSchema>) {
  const { success, data } = signUpSchema.safeParse(unsafeDate);

  if (!success) {
    return "Invalid input data";
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (existingUser != null) return "User already exists with this email";

  try {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        salt,
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (user == null) return "Unable to create user";
    await createUserSession(user, await cookies());
  } catch (error) {
    return "Unable to create user, with error: " + error;
  }

  redirect("/");
}

export async function logOut() {
    await removeUserFromSession(await cookies());
    redirect("/")
}