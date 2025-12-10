/*
  Warnings:

  - You are about to drop the `FoodForestSpecies` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Conditions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Conditions` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FoodForestSpecies";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conditions" (
    "plantId" INTEGER NOT NULL,
    "temperature" REAL,
    "humidity" REAL,
    "soilPH" REAL,
    "soilMoisture" REAL,
    "sunlight" REAL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("createdAt", "plantId"),
    CONSTRAINT "Conditions_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conditions" ("createdAt", "humidity", "plantId", "soilMoisture", "soilPH", "status", "sunlight", "temperature") SELECT "createdAt", "humidity", "plantId", "soilMoisture", "soilPH", "status", "sunlight", "temperature" FROM "Conditions";
DROP TABLE "Conditions";
ALTER TABLE "new_Conditions" RENAME TO "Conditions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
