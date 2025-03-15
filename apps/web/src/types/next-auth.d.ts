import { UserRole } from "@food-waste/types"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    role: UserRole
    password?: string
  }
  
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
    }
  }
} 