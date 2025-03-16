"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import { toast } from "@/components/ui/use-toast";
import { UserRole } from "@food-waste/types";

export default function RegisterOauthPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      email: session?.user.email,
      role,
    };

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast({
        title: "Success",
        description: "Your account has been created. Please sign in.",
      });

      router.push("/auth/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-primary lg:flex dark:border-r">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/leaf.jpg')" }} />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="text-primary">Food Waste Marketplace</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold">
              &ldquo;Join our community of businesses and consumers working
              together to reduce food waste.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Complete Registration
            </h1>
            <p className="text-sm text-muted-foreground">
              Select your role to complete the registration
            </p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" required value={role} onValueChange={setRole}>
                    <SelectTrigger disabled={isLoading} className="bg-white text-primary-dark">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-primary-dark">
                      <SelectItem value={UserRole.BUSINESS} className="hover:bg-primary hover:text-white">
                        Business
                      </SelectItem>
                      <SelectItem value={UserRole.CONSUMER} className="hover:bg-primary hover:text-white">
                        Consumer
                      </SelectItem>
                      <SelectItem value={UserRole.COURIER} className="hover:bg-primary hover:text-white">
                        Courier
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Complete Registration
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}