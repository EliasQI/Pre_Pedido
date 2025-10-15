import { Router } from "express";
import { getOrders, createOrder, updateOrder } from "../controllers/orderController.js";

const router = Router();

// rota para listar pedidos
router.get("/", getOrders);

// rota para criar novo pedido
router.post("/", createOrder);

// rota para atualizar pedido
router.put("/:id", updateOrder);

export default router;