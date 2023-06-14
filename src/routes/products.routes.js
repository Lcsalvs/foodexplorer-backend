const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const ProductsController = require("../controllers/ProductsController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const productsRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const productsController = new ProductsController();
productsRoutes.get("/", productsController.index);
productsRoutes.post(
  "/",
  ensureAuthenticated,
  upload.single("avatarFile"),
  productsController.create
);
productsRoutes.put(
  "/:id",
  ensureAuthenticated,
  upload.single("avatarFile"),
  productsController.update
);
productsRoutes.get("/:id", productsController.show);
productsRoutes.delete("/:id", ensureAuthenticated, productsController.delete);


module.exports = productsRoutes;
