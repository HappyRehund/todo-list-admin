//src/app/data/user/auth.ts
import "server-only"
import { cookies } from "next/headers";
import { getUserFromSession } from "../../../lib/session/auth-session";
import { prisma } from "../../../lib/client/prisma";
import { redirect } from "next/navigation";
import { cache } from "react";


// Retrieve informasi dari database itu 
type FullUser = Exclude<
  Awaited<ReturnType<typeof getUserFromDb>>,
  undefined | null
>;

type User = Exclude<
  Awaited<ReturnType<typeof getUserFromSession>>,
  undefined | null
>;

function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound: true;
}): Promise<FullUser>;
function _getCurrentUser(options: {
  withFullUser: true;
  redirectIfNotFound?: false;
}): Promise<FullUser | null>;
function _getCurrentUser(options: {
  withFullUser?: false;
  redirectIfNotFound: true;
}): Promise<User>;
function _getCurrentUser(options?: {
  withFullUser?: false;
  redirectIfNotFound?: false;
}): Promise<User | null>;
async function _getCurrentUser({
  withFullUser = false,
  redirectIfNotFound = false,
} = {}) {
  const user = await getUserFromSession(await cookies());

  if (user == null) {
    if (redirectIfNotFound) return redirect("/sign-in");
    
    return null;
  }

  if (withFullUser) {
    const fullUser = await getUserFromDb(user.id);
    
    if (fullUser == null) return redirect("/sign-in");
    return fullUser;
  }

  return user;
}

export const getCurrentUser = cache(_getCurrentUser);

function getUserFromDb(id: string) {
  return prisma.user.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    },
  });
}
