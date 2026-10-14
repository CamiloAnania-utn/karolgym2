const router = require("express").Router();
const ctrl = require("../controllers/freeContentController");
const { attachUserIfPresent } = require("../middleware/auth");

router.get("/", ctrl.list);
router.get("/:id", attachUserIfPresent, ctrl.get);

module.exports = router;
