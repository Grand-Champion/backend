-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FoodForest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "ownerId" INTEGER,
    CONSTRAINT "FoodForest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodForest" ("id", "location", "name", "ownerId") SELECT "id", "location", "name", "ownerId" FROM "FoodForest";
DROP TABLE "FoodForest";
ALTER TABLE "new_FoodForest" RENAME TO "FoodForest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
