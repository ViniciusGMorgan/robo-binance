import jwt from "jsonwebtoken";
import * as Yup from "yup";
import authConfig from "../../config/auth";
import User from "../models/User";

class UserController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const Users = await User.findAll({
      limit: 20,
      offset: (page - 1) * 20,
    });
    return res.json(Users);
  }

  async userExist(req, res) {
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) {
      return res.json(true);
    } else {
      return res.json(false);
    }
  }
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      name: Yup.string().required().min(5),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Verifique os campos enviados" });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: "Usuário já existe" });
    }

    const { id, email, name } = await User.create(req.body);

    return res.json({
      id,
      email,
      name,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new UserController();
