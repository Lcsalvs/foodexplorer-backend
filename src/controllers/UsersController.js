const { hash } = require("bcryptjs");
const AppError = require("../utils/AppError");

const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, password, ...rest } = request.body;

    const checkUserExists = await knex("users").where({ email }).first();

    if (checkUserExists) {
      throw new AppError("Este email já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
      ...rest,
    });

    return response
      .status(201)
      .json({ message: "Usuário criado com sucesso!" });
  }
}

module.exports = UsersController;
