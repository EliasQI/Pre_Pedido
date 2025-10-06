import prisma from "../db.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = await prisma.product.create({ data: { name, price } });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar produto" });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
};