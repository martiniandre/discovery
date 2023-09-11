/*
  Warnings:

  - Added the required column `originalURL` to the `upload` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_upload" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "userId" TEXT,
    "previewURL" TEXT NOT NULL,
    "originalURL" TEXT NOT NULL,
    "URL" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT 'IMAGE',
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "upload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_upload" ("URL", "content", "created_at", "description", "id", "name", "previewURL", "slug", "updated_at", "userId") SELECT "URL", "content", "created_at", "description", "id", "name", "previewURL", "slug", "updated_at", "userId" FROM "upload";
DROP TABLE "upload";
ALTER TABLE "new_upload" RENAME TO "upload";
CREATE UNIQUE INDEX "upload_userId_key" ON "upload"("userId");
CREATE UNIQUE INDEX "upload_slug_key" ON "upload"("slug");
CREATE INDEX "upload_slug_idx" ON "upload"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
