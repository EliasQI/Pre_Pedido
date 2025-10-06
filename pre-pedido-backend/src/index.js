import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// rotas
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend rodando na porta ${PORT}`));