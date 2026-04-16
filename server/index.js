require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");

const productsRouter = require("./routes/products");
const cartRouter = require("./routes/cart");
const checkoutRouter = require("./routes/checkout");
const invoiceRouter = require("./routes/invoice");
const verifyRouter = require("./routes/verify");

const app = express();
const PORT = process.env.PORT || 5000;

// Security & parsing middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", service: "SwiftCart API" }));

// Routes
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/invoice", invoiceRouter);
app.use("/api/v1/verify", verifyRouter);

// 404 handler
app.use((req, res) => res.status(404).json({ status: "error", message: "Route not found" }));

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`SwiftCart API running on http://localhost:${PORT}`);
});
