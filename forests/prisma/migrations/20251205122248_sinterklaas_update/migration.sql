/*
  Warnings:

  - You are about to drop the column `category` on the `Species` table. All the data in the column will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "FoodForestSpecies" (
    "foodForestId" INTEGER NOT NULL,
    "speciesId" INTEGER NOT NULL,

    PRIMARY KEY ("foodForestId", "speciesId"),
    CONSTRAINT "FoodForestSpecies_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FoodForestSpecies_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conditions" (
    "plantId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temperature" REAL,
    "humidity" REAL,
    "soilPH" REAL,
    "soilMoisture" REAL,
    "sunlight" REAL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Conditions_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conditions" ("humidity", "plantId", "soilMoisture", "soilPH", "status", "sunlight", "temperature") SELECT "humidity", "plantId", "soilMoisture", "soilPH", "status", "sunlight", "temperature" FROM "Conditions";
DROP TABLE "Conditions";
ALTER TABLE "new_Conditions" RENAME TO "Conditions";
CREATE TABLE "new_FoodForest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT,
    "ownerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "FoodForest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FoodForest" ("id", "location", "name", "ownerId") SELECT "id", "location", "name", "ownerId" FROM "FoodForest";
DROP TABLE "FoodForest";
ALTER TABLE "new_FoodForest" RENAME TO "FoodForest";
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
    "plantStage" TEXT,
    "last_inspected" DATETIME,
    "plant_health" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("foodForestId", "harvestPrediction", "height", "id", "image", "posX", "posY", "speciesId", "stage") SELECT "foodForestId", "harvestPrediction", "height", "id", "image", "posX", "posY", "speciesId", "stage" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
CREATE TABLE "new_Species" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "scientificName" TEXT,
    "harvestSeason" TEXT,
    "sunRequirement" TEXT,
    "waterNeeds" TEXT,
    "maintenance" TEXT,
    "minTemperature" REAL,
    "maxTemperature" REAL,
    "minHumidity" REAL,
    "maxHumidity" REAL,
    "minSoilPH" REAL,
    "maxSoilPH" REAL,
    "minSoilMoisture" REAL,
    "maxSoilMoisture" REAL,
    "minSunlight" REAL,
    "maxSunlight" REAL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);
INSERT INTO "new_Species" ("description", "harvestSeason", "id", "maintenance", "maxHumidity", "maxSoilMoisture", "maxSoilPH", "maxSunlight", "maxTemperature", "minHumidity", "minSoilMoisture", "minSoilPH", "minSunlight", "minTemperature", "name", "scientificName", "sunRequirement", "waterNeeds") SELECT "description", "harvestSeason", "id", "maintenance", "maxHumidity", "maxSoilMoisture", "maxSoilPH", "maxSunlight", "maxTemperature", "minHumidity", "minSoilMoisture", "minSoilPH", "minSunlight", "minTemperature", "name", "scientificName", "sunRequirement", "waterNeeds" FROM "Species";
DROP TABLE "Species";
ALTER TABLE "new_Species" RENAME TO "Species";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME
);
INSERT INTO "new_User" ("id") SELECT "id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
