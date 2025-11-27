-- AlterTable
ALTER TABLE "Conditions" ADD COLUMN "status" TEXT;

-- AlterTable
ALTER TABLE "Species" ADD COLUMN "category" TEXT;
ALTER TABLE "Species" ADD COLUMN "harvestSeason" TEXT;
ALTER TABLE "Species" ADD COLUMN "maintenance" TEXT;
ALTER TABLE "Species" ADD COLUMN "maxHumidity" REAL;
ALTER TABLE "Species" ADD COLUMN "maxSoilMoisture" REAL;
ALTER TABLE "Species" ADD COLUMN "maxSoilPH" REAL;
ALTER TABLE "Species" ADD COLUMN "maxSunlight" REAL;
ALTER TABLE "Species" ADD COLUMN "maxTemperature" REAL;
ALTER TABLE "Species" ADD COLUMN "minHumidity" REAL;
ALTER TABLE "Species" ADD COLUMN "minSoilMoisture" REAL;
ALTER TABLE "Species" ADD COLUMN "minSoilPH" REAL;
ALTER TABLE "Species" ADD COLUMN "minSunlight" REAL;
ALTER TABLE "Species" ADD COLUMN "minTemperature" REAL;
ALTER TABLE "Species" ADD COLUMN "scientificName" TEXT;
ALTER TABLE "Species" ADD COLUMN "sunRequirement" TEXT;
ALTER TABLE "Species" ADD COLUMN "waterNeeds" TEXT;

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
    CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("foodForestId", "harvestPrediction", "id", "speciesId", "stage") SELECT "foodForestId", "harvestPrediction", "id", "speciesId", "stage" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
