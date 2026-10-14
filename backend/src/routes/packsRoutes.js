const router = require("express").Router();
const ctrl = require("../controllers/packsController");
const { attachUserIfPresent, requireAuth } = require("../middleware/auth");

router.get("/", ctrl.listPacks);
router.get("/sub-packs/:id", attachUserIfPresent, ctrl.getSubPack);
router.get("/routines/:id", requireAuth, ctrl.getRoutine);
router.get("/:slug", ctrl.getPackBySlug);

module.exports = router;
