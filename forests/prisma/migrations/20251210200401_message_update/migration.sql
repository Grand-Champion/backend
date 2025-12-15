-- CreateTable
CREATE TABLE "Messages" (
    "userId" INTEGER NOT NULL,
    "foodForestId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message" TEXT NOT NULL,
    "image" TEXT,

    PRIMARY KEY ("userId", "foodForestId"),
    CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Messages_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "plantStage" TEXT,
    "lastInspected" DATETIME,
    "plantHealth" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" DATETIME,
    CONSTRAINT "Plant_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_foodForestId_fkey" FOREIGN KEY ("foodForestId") REFERENCES "FoodForest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Plant_foodForestId_speciesId_fkey" FOREIGN KEY ("foodForestId", "speciesId") REFERENCES "FoodForestSpecies" ("foodForestId", "speciesId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Plant" ("createdAt", "deletedAt", "foodForestId", "harvestPrediction", "height", "id", "image", "lastInspected", "plantHealth", "plantStage", "posX", "posY", "speciesId", "stage", "updatedAt") SELECT "createdAt", "deletedAt", "foodForestId", "harvestPrediction", "height", "id", "image", "lastInspected", "plantHealth", "plantStage", "posX", "posY", "speciesId", "stage", "updatedAt" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
