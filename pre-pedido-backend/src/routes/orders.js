import { Router } from "express";
import { getOrders, createOrder } from "../controllers/orderController.js";

const router = Router();

// rota para listar pedidos
router.get("/", getOrders);

// rota para criar novo pedido
router.post("/", createOrder);

export default router;