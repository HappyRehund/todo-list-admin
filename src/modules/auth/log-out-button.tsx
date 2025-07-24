"use client";

import { logOut } from "@/actions/auth/auth-action";
import { Button } from "@/components/ui/button";
export function LogOutButton() {
  return (
    <Button variant="destructive" onClick={async () => await logOut()}>
      Log Out
    </Button>
  );
}
