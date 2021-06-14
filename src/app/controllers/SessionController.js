import axios from "axios";
import * as Yup from "yup";

class Autenticacao {
  async login(req, res) {
    const schema = Yup.object().shape({
      login: Yup.string().required(),
      senha: Yup.string().required(),
      idModulo: Yup.number().required(),
    });

    const { login, senha, idModulo } = req.body;

    if (!(await schema.isValid({ login, senha, idModulo }))) {
      return res.status(400).json({ error: "Verifique os campos enviados" });
    }

    const response = await axios.post(
      "https://osautenticacao.azurewebsites.net/api/v1/Autenticar/V2",
      {
        login,
        senha,
        idModulo,
      }
    );

    console.log(response);
  }
}
export default new Autenticacao()