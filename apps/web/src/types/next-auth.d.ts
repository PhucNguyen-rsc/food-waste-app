import { UserRole } from "@food-waste/types"
import "next-auth"

declare module "next-auth" {
  interface User {
    role: UserRole
    password?: string
  }
  
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
    }
    token?: string
  }
} 