const router = require("express").Router();
const ctrl = require("../controllers/walkController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);
router.post("/", ctrl.start);
router.put("/:id", ctrl.update);
router.get("/", ctrl.myWalks);

module.exports = router;
