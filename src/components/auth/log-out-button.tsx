/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { logOut } from "@/actions/auth/auth-action";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";

export function LogOutButton() {
  const [state, formAction, isPending] = useActionState(logOut, null);

  return (
    <form action={formAction}>
      <Button 
        variant="destructive" 
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Logging out..." : "Log Out"}
      </Button>
    </form>
  );
}