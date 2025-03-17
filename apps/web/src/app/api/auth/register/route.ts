import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request){

  const { name, email, password, role } = await req.json();

  if (!name || !email || !password || !role) {
    return NextResponse.json({ message: "All fields are required" }, {status: 400}); // Bad Request
  }

  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, {status: 409}); // Conflict
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json({ message: "User created successfully", user }, {status: 201});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal server error" }, {status: 500});
  }
}