const Express = require("express");
const { getForests, getForest, createForest, updateForest, deleteForest } = require("../controllers/forestController.js");
const router = Express.Router();

router.get("/forests", /* hier bijv. Cors middleware, */getForests);
router.get("/forests/:id", getForest);
router.post("/forests", createForest);
router.patch("/forests/:id", updateForest);
router.delete("/forests/:id", deleteForest);

router.get('/', (req, res) => {
  res.send('Je hebt de forests api v1 bereikt!');
});

module.exports = router;