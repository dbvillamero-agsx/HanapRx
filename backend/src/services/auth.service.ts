import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma, config } from "../config/index.js";
import { AppError } from "../middleware/errorHandler.js";
import type { LoginInput } from "../schemas/auth.schema.js";

export async function login(input: LoginInput) {
  const user = await prisma.adminUser.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: { id: user.id, email: user.email, role: user.role },
  };
}

export async function getProfile(userId: number) {
  const user = await prisma.adminUser.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    throw new AppError(404, "User not found");
  }

  return user;
}
