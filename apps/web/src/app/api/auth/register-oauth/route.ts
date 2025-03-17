import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();

    const user = await prisma.user.update({
      where: { email },
      data: { role },
    });

    return NextResponse.json({ message: "User role updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
