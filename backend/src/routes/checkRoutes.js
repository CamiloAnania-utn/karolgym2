const router = require("express").Router();
const ctrl = require("../controllers/checkController");
const { requireAuth } = require("../middleware/auth");

router.get("/comunidad", ctrl.community);
router.use(requireAuth);
router.post("/", ctrl.create);
router.get("/mios", ctrl.mine);

module.exports = router;
