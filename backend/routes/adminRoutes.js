const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.use(authMiddleware, adminMiddleware);

router.get("/stats", adminController.getStats);

router.get("/users", adminController.getUsers);
router.delete("/users/:id", adminController.deleteUser);

router.get("/products", adminController.getProducts);
router.delete("/products/:id", adminController.deleteProduct);

router.get("/animals", adminController.getAnimals);
router.delete("/animals/:id", adminController.deleteAnimal);

module.exports = router;
