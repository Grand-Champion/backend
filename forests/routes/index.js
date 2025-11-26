const Express = require("express");
const { getForests, getForest, createForest, updateForest, deleteForest } = require("../controllers/forestController.js");
const { getSpeciesMany, getSpecies, createSpecies, updateSpecies, deleteSpecies } = require("../controllers/speciesController.js");
const { getPlant, updatePlant, deletePlant, createPlant } = require("../controllers/plantController.js");
const router = Express.Router();

router.get("/forests", /* hier bijv. Cors middleware, */getForests);
router.get("/forests/:id", getForest);
router.post("/forests", createForest);
router.patch("/forests/:id", updateForest);
router.delete("/forests/:id", deleteForest);

router.post("/forests/:id/plants", createPlant);

router.get("/plants/:id", getPlant);
router.patch("/plants/:id", updatePlant);
router.delete("/plants/:id", deletePlant);

router.get("/species", getSpeciesMany);
router.get("/species/:id", getSpecies);
router.post("/species", createSpecies);
router.patch("/species/:id", updateSpecies);
router.delete("/species/:id", deleteSpecies);

router.get('/', (req, res) => {
    res.send('Je hebt de forests api v1 bereikt!');
});

module.exports = router;