-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FoodForest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,
    `ownerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Species` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `scientificName` VARCHAR(191) NULL,
    `harvestSeason` VARCHAR(191) NULL,
    `sunRequirement` VARCHAR(191) NULL,
    `waterNeeds` VARCHAR(191) NULL,
    `maintenance` VARCHAR(191) NULL,
    `minTemperature` DOUBLE NULL,
    `maxTemperature` DOUBLE NULL,
    `minHumidity` DOUBLE NULL,
    `maxHumidity` DOUBLE NULL,
    `minSoilPH` DOUBLE NULL,
    `maxSoilPH` DOUBLE NULL,
    `minSoilMoisture` DOUBLE NULL,
    `maxSoilMoisture` DOUBLE NULL,
    `minSunlight` DOUBLE NULL,
    `maxSunlight` DOUBLE NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `stage` VARCHAR(191) NULL,
    `harvestPrediction` VARCHAR(191) NULL,
    `speciesId` INTEGER NOT NULL,
    `foodForestId` INTEGER NOT NULL,
    `height` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `posX` DOUBLE NOT NULL DEFAULT 0,
    `posY` DOUBLE NOT NULL DEFAULT 0,
    `lastInspected` DATETIME(3) NULL,
    `plantHealth` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conditions` (
    `plantId` INTEGER NOT NULL,
    `temperature` DOUBLE NULL,
    `humidity` DOUBLE NULL,
    `soilPH` DOUBLE NULL,
    `soilMoisture` DOUBLE NULL,
    `sunlight` DOUBLE NULL,
    `status` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`createdAt`, `plantId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `userId` INTEGER NOT NULL,
    `foodForestId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `message` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NULL,

    PRIMARY KEY (`userId`, `foodForestId`, `createdAt`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FoodForest` ADD CONSTRAINT `FoodForest_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plant` ADD CONSTRAINT `Plant_speciesId_fkey` FOREIGN KEY (`speciesId`) REFERENCES `Species`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Plant` ADD CONSTRAINT `Plant_foodForestId_fkey` FOREIGN KEY (`foodForestId`) REFERENCES `FoodForest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conditions` ADD CONSTRAINT `Conditions_plantId_fkey` FOREIGN KEY (`plantId`) REFERENCES `Plant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Messages` ADD CONSTRAINT `Messages_foodForestId_fkey` FOREIGN KEY (`foodForestId`) REFERENCES `FoodForest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
