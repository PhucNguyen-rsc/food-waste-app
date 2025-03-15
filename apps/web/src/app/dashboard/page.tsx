import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { UserRole } from "@food-waste/types";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user.role as UserRole;

  switch (role) {
    case UserRole.BUSINESS:
      redirect("/dashboard/business");
    case UserRole.CONSUMER:
      redirect("/dashboard/consumer");
    case UserRole.COURIER:
      redirect("/dashboard/courier");
    case UserRole.ADMIN:
      redirect("/dashboard/admin");
    default:
      redirect("/");
  }
} 