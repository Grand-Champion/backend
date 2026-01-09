const Express = require("express");
const { getForests, getForest, createForest, updateForest, deleteForest, getFoodForestSpecies, getFoodForestMessages } = require("../controllers/forestController.js");
const { getSpeciesMany, getSpecies, createSpecies, updateSpecies, deleteSpecies, getSpeciesFoodForests } = require("../controllers/speciesController.js");
const { getPlant, updatePlant, deletePlant, createPlant } = require("../controllers/plantController.js");
const { getMessages, createMessage, updateMessage, deleteMessage } = require("../controllers/messageController.js");
const { ingelogd, token } = require("../middleware/authentication");
const router = Express.Router();

router.get("/forests", getForests);
router.get("/forests/:id", getForest);
router.post("/forests", token, ingelogd, createForest);
router.patch("/forests/:id", token, ingelogd, updateForest);
router.delete("/forests/:id", token, ingelogd, deleteForest);

router.post("/forests/:id/plants", token, ingelogd, createPlant);
router.get("/forests/:id/species", getFoodForestSpecies);
router.get("/forests/:id/messages", getFoodForestMessages);
router.get("/species/:id/forests", getSpeciesFoodForests);

router.get("/plants/:id", getPlant);
router.patch("/plants/:id", token, ingelogd, updatePlant);
router.delete("/plants/:id", token, ingelogd, deletePlant);

router.get("/species", getSpeciesMany);
router.get("/species/:id", getSpecies);
router.post("/species", token, ingelogd, createSpecies);
router.patch("/species/:id", token, ingelogd, updateSpecies);
router.delete("/species/:id", token, ingelogd, deleteSpecies);

router.get("/messages", getMessages);
router.post("/messages", token, ingelogd, createMessage);
router.patch("/messages/:userId/:foodForestId/:createdAt", token, ingelogd, updateMessage);
router.delete("/messages/:userId/:foodForestId/:createdAt", token, ingelogd, deleteMessage);

router.get('/', (req, res) => {
    res.send('Je hebt de forests api v1 bereikt!');
});

module.exports = router;
