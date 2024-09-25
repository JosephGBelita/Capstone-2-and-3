const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");

const { verify, verifyAdmin, isloggedIn } = auth;
const router = express.Router();

router.post("/", verify, verifyAdmin, productController.addProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProducts);
router.get("/", productController.getAllActiveProducts);
router.get("/specific/:id", productController.getProduct);
router.patch("/:productId", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);
router.post('/search', productController.searchProductsByName);

module.exports = router;
