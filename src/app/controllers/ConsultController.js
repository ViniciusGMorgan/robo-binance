import axios from "axios";
import querystring from "querystring";
import crypto from "crypto";

const apiKey = process.env.API_KEY;
const apiSecret = process.env.SECRET_KEY;

async function publicCall(path, data, method = "GET") {
  try {
    const qs = data ? `?${querystring.stringify(data)}` : "";
    const result = await axios({
      method,
      url: `${process.env.API_URL_BINANCE}${path}${qs}`,
    });

    return result.data;
  } catch (err) {
    console.log(err);
  }
}

async function privateCall(path, data = {}, method = "GET") {
  const timestamp = Date.now();
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${querystring.stringify({ ...data, timestamp })}`)
    .digest("hex");

  const newData = { ...data, timestamp, signature };
  const qs = `?${querystring.stringify(newData)}`;

  try {
    const result = await axios({
      method,
      url: `${process.env.API_URL_BINANCE}${path}${qs}`,
      headers: { "X-MBX-APIKEY": apiKey },
    });

    return result.data;
  } catch (err) {
    console.log(err);
  }
}

class ConsultController {
  async orders(req, res) {
    const { symbol } = req.query;
    const limit = 5
    let buy = "Indisponível no momento",
      sell = "Indisponível no momento";

    const result = await publicCall("/v3/depth", { symbol, limit });
    if (result.bids && result.bids.length) {
      buy = result.bids[0][0];
    }

    if (result.asks && result.asks.length) {
      sell = result.asks[0][0];
    }

    return res.send({ "Melhor compra: ": buy, "Melhor venda: ": sell });
  }

  async accountInfo(req, res) {
    const result = await privateCall("/v3/account");
    return res.send({ result });
  }

  async newOrder(req, res) {
    const query = req.query;
  }
}

export default new ConsultController();
