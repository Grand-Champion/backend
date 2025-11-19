const Express = require("express");
const { getForests } = require("../controllers/forestController.js");
const router = Express.Router();

router.get(`/forests`, /* hier bijv. Cors middleware, */getForests);

router.get('/', (req, res) => {
  res.send('Je hebt de forests api bereikt!');
});

module.exports = router;