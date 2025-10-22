import { Router } from "express";
import { getOrders, createOrder, updateOrder, getOrderHistory, cancelOrder } from "../controllers/orderController.js";

const router = Router();

// rota para listar pedidos
router.get("/", getOrders);

// rota para criar novo pedido
router.post("/", createOrder);

// rota para atualizar pedido
router.put("/:id", updateOrder);

// rota para o histórico de pedidos
router.get('/history/:userId', getOrderHistory);

// rota para status de pedido cancelado
router.put('/:id/cancel/', cancelOrder)

// rota para o relatório de vendas
router.get()

export default router;