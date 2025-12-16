/*
  Warnings:

  - You are about to drop the column `plantStage` on the `Plant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "stage" TEXT,
    "harvestPrediction" TEXT,
    "speciesId" INTEGER NOT NULL,
    "foodForestId" INTEGER NOT NULL,
    "height" TEXT,
    "image" TEXT,
    "posX" REAL NOT NULL DEFAULT 0,
    "posY" REAL NOT NULL DEFAULT 0,
    "lastInspected" DATETIME,
    "plantHealth" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("createdAt", "deletedAt", "foodForestId", "harvestPrediction", "height", "id", "image", "lastInspected", "plantHealth", "posX", "posY", "speciesId", "stage", "updatedAt") SELECT "createdAt", "deletedAt", "foodForestId", "harvestPrediction", "height", "id", "image", "lastInspected", "plantHealth", "posX", "posY", "speciesId", "stage", "updatedAt" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
