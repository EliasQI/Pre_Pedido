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