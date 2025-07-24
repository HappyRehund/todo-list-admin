"use client";
import { signUp } from "@/actions/auth/auth-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export function SignUpForm() {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema), // Tambahkan zodResolver
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof signUpSchema>) {
    setError(undefined); // Clear previous errors
    
    startTransition(async () => {
      try {
        const result = await signUp(data);
        if (result) {
          setError(result);
        }
        // Jika result undefined/null, berarti berhasil dan akan redirect
      } catch (err) {
        // Handle NEXT_REDIRECT error (this is expected behavior for successful redirects)
        if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
          // Don't set error for redirect - this means success
          return;
        }
        
        console.error("Sign up error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {error && (
          <div className="p-3 rounded-md bg-destructive/15 border border-destructive/20">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
        
        <div className="flex gap-4 justify-between">
          <Button type="button" variant="outline" disabled={isPending}>
            Discord
          </Button>
          <Button type="button" variant="outline" disabled={isPending}>
            Github
          </Button>
        </div>

        {/* -- Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input 
                  type="text" 
                  placeholder="Enter your name"
                  disabled={isPending}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* -- Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email"
                  disabled={isPending}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* -- Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Enter your password"
                  disabled={isPending}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 justify-end">
          <Button asChild variant="link" disabled={isPending}>
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </div>
      </form>
    </Form>
  );
}