import prisma from "../db.js";

export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};