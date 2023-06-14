const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class ProductsController {
  async create(request, response) {
    const { name, description, category, price, ingredients } = request.body;
    const user_id = request.user.id;
   
    const diskStorage = new DiskStorage();

    const avatar = await diskStorage.saveFile(request.file.filename);

    await knex("products").insert({
      avatar,
      name,
      description,
      ingredients: JSON.stringify(ingredients),
      category,
      price,
      user_id,
    });

    return response.json();
  }

  async update(request, response) {
    const { name, description, category, price, ingredients } = request.body;
    const { id } = request.params;

    var newIngredients = ingredients;

    if (typeof ingredients === "string") {
      newIngredients = JSON.parse(ingredients);
    }

    const product = await knex("products").where({ id }).first();

    if (!product) {
      throw new AppError("Produto não encontrado.");
    }

    if (request.file) {
      const diskStorage = new DiskStorage();

      if (product.avatar) {
        await diskStorage.deleteFile(product.avatar);
      }

      const filename = await diskStorage.saveFile(request.file.filename);
      product.avatar = filename;
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.category = category ?? product.category;
    product.price = price ?? product.price;
    product.ingredients = newIngredients ?? product.ingredients;
    product.ingredients = JSON.stringify(product.ingredients);
    product.updated_at = knex.fn.now();

    await knex("products")
      .update({ ...product })
      .where({ id });

    return response.json({ message: "Produto alterado com sucesso." });
  }

  async show(request, response) {
    const { id } = request.params;

    const product = await knex("products").where({ id }).first();

    if (!product) {
      throw new AppError("Produto não encontrado.", 404);
    }
    return response.json({
      ...product,
    });
  }

  async index(request, response) {
    const { search } = request.query;
    let products = null;

    if (search) {
      products = await knex("products")
        .orWhereLike("name", `%${search}%`)
        .orWhereLike("description", `%${search}%`)
        .orWhereLike("ingredients", `%${search}%`);
    } else {
      products = await knex("products");
    }

    return response.json(products);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("products").where({ id }).delete();

    return response.json({ message: "Produto deletado com sucesso." });
  }
}

module.exports = ProductsController;
