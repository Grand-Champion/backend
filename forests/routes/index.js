const Express = require("express");
const { getForests, getForest, createForest, updateForest, deleteForest, getFoodForestSpecies } = require("../controllers/forestController.js");
const { getSpeciesMany, getSpecies, createSpecies, updateSpecies, deleteSpecies, getSpeciesFoodForests } = require("../controllers/speciesController.js");
const { getPlant, updatePlant, deletePlant, createPlant } = require("../controllers/plantController.js");
const { getMessages, createMessage, updateMessage, deleteMessage } = require("../controllers/messageController.js");
const { storeSensorData } = require("../controllers/sensorController.js");

const router = Express.Router();

router.get("/forests", /* als je middleware nodig hebt (bijv. authenticatie), zou je die hier toe kunnen voegen */getForests);
router.get("/forests/:id", getForest);
router.post("/forests", createForest);
router.patch("/forests/:id", updateForest);
router.delete("/forests/:id", deleteForest);

router.post("/forests/:id/plants", createPlant);
router.get("/forests/:id/species", getFoodForestSpecies);
router.get("/species/:id/forests", getSpeciesFoodForests);

router.get("/plants/:id", getPlant);
router.patch("/plants/:id", updatePlant);
router.delete("/plants/:id", deletePlant);

router.get("/species", getSpeciesMany);
router.get("/species/:id", getSpecies);
router.post("/species", createSpecies);
router.patch("/species/:id", updateSpecies);
router.delete("/species/:id", deleteSpecies);

router.get("/messages", getMessages);
router.post("/messages", createMessage);
router.patch("/messages/:userId/:foodForestId/:createdAt", updateMessage);
router.delete("/messages/:userId/:foodForestId/:createdAt", deleteMessage);

router.post('/sensor-data', storeSensorData);

router.get('/', (req, res) => {
    res.send('Je hebt de forests api v1 bereikt!');
});

module.exports = router;