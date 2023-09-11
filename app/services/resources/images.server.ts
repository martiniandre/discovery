import { Prisma, type Upload } from "@prisma/client";
import { prisma } from "../db.server";

type Payload = Omit<Upload, "createdAt" | "updatedAt" | "id">;

export async function save(payload: Payload) {
  return await prisma.upload.create({
    data: payload,
  });
}

export async function listAll() {
  return await prisma.upload.findMany({
    include: {
      User: true,
    },
  });
}

export async function getBySlug(id: string) {
  return await prisma.upload.findUnique({
    where: {
      id,
    },
    include: {
      User: true,
    },
  });
}

export async function findBy(search: string) {
  if (search.trim().length === 0) return await listAll();
  return await prisma.$queryRaw(
    Prisma.sql`SELECT * FROM "upload" WHERE name LIKE ${search}`
  );
}
