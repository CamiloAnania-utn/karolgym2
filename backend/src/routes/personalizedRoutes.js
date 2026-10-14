const router = require("express").Router();
const ctrl = require("../controllers/personalizedController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);
router.post("/", ctrl.request);
router.get("/mias", ctrl.mine);

module.exports = router;
