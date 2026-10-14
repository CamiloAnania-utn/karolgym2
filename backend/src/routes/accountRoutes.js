const router = require("express").Router();
const ctrl = require("../controllers/accountController");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);
router.get("/perfil", ctrl.getProfile);
router.put("/perfil", ctrl.updateProfile);
router.put("/notificaciones", ctrl.updateNotificationSettings);
router.get("/packs-activos", ctrl.myActivePacks);
router.get("/favoritos", ctrl.myFavorites);
router.post("/favoritos", ctrl.addFavorite);
router.delete("/favoritos/:id", ctrl.removeFavorite);
router.get("/historial", ctrl.myHistory);
router.post("/historial", ctrl.completeWorkout);

module.exports = router;
