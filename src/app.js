import "dotenv/config";

import express from "express";
import http from "http";
import cors from "cors";
import routes from "./routes";

import "./database";
class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }

  exceptionHandler() {
    this.app.use(async (err, req, res, next) => {
      return res.status(500).json({ error: "Internal Server Error" });
    });
  }
}

export default new App().server;
