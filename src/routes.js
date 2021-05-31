import { Router } from "express";

import authMiddleware from "./app/middlewares/auth";
import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";
import ConsultController from "./app/controllers/ConsultController";

const routes = new Router();

routes.post("/sessions", SessionController.store);
routes.post("/users", UserController.store);

routes.use(authMiddleware);
routes.get("/users", UserController.index);
routes.get("/orders", ConsultController.orders);
routes.get("/account", ConsultController.accountInfo);

export default routes;
