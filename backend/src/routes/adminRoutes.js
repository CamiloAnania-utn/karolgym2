const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.use(requireAuth, requireAdmin);

// Packs
router.get("/packs", ctrl.listAllPacks);
router.post("/packs", ctrl.createPack);
router.put("/packs/:id", ctrl.updatePack);
router.delete("/packs/:id", ctrl.deletePack);

// SubPacks
router.post("/sub-packs", ctrl.createSubPack);
router.put("/sub-packs/:id", ctrl.updateSubPack);
router.delete("/sub-packs/:id", ctrl.deleteSubPack);

// Rutinas
router.post("/rutinas", ctrl.createRoutine);
router.put("/rutinas/:id", ctrl.updateRoutine);
router.delete("/rutinas/:id", ctrl.deleteRoutine);

// Contenido gratuito
router.get("/contenido-gratis", ctrl.listAllFreeContent);
router.post("/contenido-gratis", ctrl.createFreeContent);
router.put("/contenido-gratis/:id", ctrl.updateFreeContent);
router.delete("/contenido-gratis/:id", ctrl.deleteFreeContent);

// Compras
router.get("/compras", ctrl.listPurchases);
router.post("/compras/:id/confirmar", ctrl.confirmPurchase);
router.post("/compras/:id/rechazar", ctrl.rejectPurchase);

// Usuarios / alumnos
router.get("/usuarios", ctrl.listUsers);
router.get("/usuarios/:id", ctrl.getUserDetail);
router.post("/usuarios/toggle-pack", ctrl.toggleUserPack);

// Personalizados
router.get("/personalizados", ctrl.listPersonalizedRequests);
router.put("/personalizados/:id", ctrl.updatePersonalizedRequest);

// Estadisticas
router.get("/estadisticas", ctrl.stats);

module.exports = router;
