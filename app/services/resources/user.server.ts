import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/services/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserByUsername(username: User["username"]) {
  return prisma.user.findUnique({ where: { username } });
}

export async function createUser(
  user: Pick<User, "username" | "email">,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function verifyLogin(
  credential: User["email"],
  password: Password["hash"]
) {
  const user =
    (await prisma.user.findUnique({
      where: { email: credential },
      include: { password: true },
    })) ??
    (await prisma.user.findUnique({
      where: { username: credential },
      include: { password: true },
    }));

  if (!user || !password || !user.password) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user?.password?.hash);

  if (!isValid) {
    return null;
  }

  const { password: hashedPassword, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
