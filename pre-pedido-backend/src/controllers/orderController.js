import prisma from "../db.js";
import { OrderStatus } from "../enums/OrderStatus";

export const createOrder = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // valida existência
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(400).json({ error: "User não encontrado" });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(400).json({ error: "Product não encontrado" });

    if (!Number.isInteger(quantity) || quantity <= 0)
      return res.status(400).json({ error: "Quantidade inválida" });

    const order = await prisma.order.create({
      data: {
        quantity,
        user: { connect: { id: userId } },
        product: { connect: { id: productId } },
        status: "PENDING"
      },
      include: {
        user: true,
        product: true
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar pedido" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true, product: true }
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
};

// Atualiza o Pedido
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus, quantity } = req.body;

    // Tradução dos status em português → inglês
    const statusMap = {
      "Pendente": "PENDING",
      "Em andamento": "IN_PROGRESS",
      "Concluído": "COMPLETED",
      "Cancelado": "CANCELED",
    };

    const translatedStatus = statusMap[newStatus?.toLowerCase()];

    if (!translatedStatus) {
      return res.status(400).json({ error: "Status inválido!" });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { 
        status: translatedStatus, 
        quantity 
      },
    });

    res.json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao atualizar o pedido" });
  }
};

// Histórico de pedidos por usuário
export const getOrderHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: parseInt(userId) },
      include: {
        product: {
          select: {
            name: true,
            price: true
          }
        },
        stall: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar histórico de pedidos' });
  }
};

// Cancelar um pedido
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params

    const order = await prisma.order.findUnique({ where: { id: Number(id) } })
    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' })
    }

    const canceledOrder = await prisma.order.update({
      where: { id: Number(id) },
      data: { status: 'cancelado' },
    })

    res.json({
      message: 'Pedido cancelado com sucesso',
      order: canceledOrder,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Erro ao cancelar pedido' })
  }
}

// Relatório geral de vendas
export const getOrdersReport = async (req, res) => {
  try {
    // Busca todos os pedidos
    const orders = await prisma.order.findMany({
      include: {
        items: true, // inclui os itens, se tiver relação
      },
    });

    // Conta pedidos por status
    const statusCounts = Object.values(OrderStatus).reduce((acc, status) => {
      acc[status] = orders.filter(order => order.status === status).length;
      return acc;
    }, {});

    // Soma o valor total de todos os pedidos
    const totalRevenue = orders.reduce(
      (acc, order) => acc + (order.total || 0),
      0
    );

    // Retorna o relatório
    return res.json({
      totalPedidos: orders.length,
      pedidosPorStatus: statusCounts,
      receitaTotal: totalRevenue,
      pedidos: orders, 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao gerar relatório de pedidos" });
  }
};