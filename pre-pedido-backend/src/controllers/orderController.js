import prisma from "../db.js";

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
        product: { connect: { id: productId } }
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
export const updateOrder = async (req, res) =>{
  try {
    const {id} = req.params;
    const {status, quantity} = req.body;

    const updateOrder = await prisma.order.update({
      where: {id: parseInt(id)},
      data: {status, quantity},
    });

    res.json(updateOrder);
  } catch(err) {
    res.status(500).json({error: "Erro ao atualizar o pedido"});
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