const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// GET /api/v1/products/scan/:barcode — fetch product by barcode (used during scanning)
router.get("/scan/:barcode", async (req, res, next) => {
  try {
    const { barcode } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("product_id, product_name, price, stock_quantity, category")
      .eq("barcode", barcode)
      .single();

    if (error || !data) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    if (data.stock_quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Product out of stock" });
    }

    res.json({
      status: "success",
      data: {
        product_id: data.product_id,
        name: data.product_name,
        price: data.price,
        category: data.category,
        stock_status: "available",
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/products — list all products (admin)
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("product_name");

    if (error) throw error;
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/products — create product (admin)
router.post("/", async (req, res, next) => {
  try {
    const { barcode, product_name, price, stock_quantity, category } = req.body;

    if (!barcode || !product_name || !price) {
      return res.status(400).json({ status: "error", message: "barcode, product_name and price are required" });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{ barcode, product_name, price, stock_quantity: stock_quantity ?? 0, category }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/products/:id — update product (admin)
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("product_id", id)
      .select()
      .single();

    if (error) throw error;
    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/products/:id — delete product (admin)
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("product_id", id);

    if (error) throw error;
    res.json({ status: "success", message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
