const router = require("express").Router();
const ctrl = require("../controllers/purchaseController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);
router.post("/", ctrl.createPurchase);
router.post("/:id/transferencia-enviada", ctrl.markTransferSent);
router.get("/mias", ctrl.myPurchases);

module.exports = router;
