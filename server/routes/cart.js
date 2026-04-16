const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// POST /api/v1/cart — create a new cart for a customer
router.post("/", async (req, res, next) => {
  try {
    const { customer_id } = req.body;
    if (!customer_id) {
      return res.status(400).json({ status: "error", message: "customer_id is required" });
    }

    const { data, error } = await supabase
      .from("carts")
      .insert([{ customer_id, total_amount: 0, tax_amount: 0 }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/cart/:cart_id — get cart with all items
router.get("/:cart_id", async (req, res, next) => {
  try {
    const { cart_id } = req.params;

    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("cart_id", cart_id)
      .single();

    if (cartError || !cart) {
      return res.status(404).json({ status: "error", message: "Cart not found" });
    }

    const { data: items, error: itemsError } = await supabase
      .from("cart_items")
      .select("*, products(product_name, price, barcode)")
      .eq("cart_id", cart_id);

    if (itemsError) throw itemsError;

    res.json({ status: "success", data: { ...cart, items } });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/cart/:cart_id/items — add or increment item in cart
router.post("/:cart_id/items", async (req, res, next) => {
  try {
    const { cart_id } = req.params;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ status: "error", message: "product_id is required" });
    }

    // Fetch product price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price, stock_quantity")
      .eq("product_id", product_id)
      .single();

    if (productError || !product) {
      return res.status(404).json({ status: "error", message: "Product not found" });
    }

    if (product.stock_quantity <= 0) {
      return res.status(400).json({ status: "error", message: "Product out of stock" });
    }

    // Check if item already in cart
    const { data: existing } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart_id)
      .eq("product_id", product_id)
      .single();

    let item;
    if (existing) {
      const newQty = existing.quantity + 1;
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: newQty, subtotal: newQty * product.price })
        .eq("cart_item_id", existing.cart_item_id)
        .select()
        .single();
      if (error) throw error;
      item = data;
    } else {
      const { data, error } = await supabase
        .from("cart_items")
        .insert([{ cart_id, product_id, quantity: 1, subtotal: product.price }])
        .select()
        .single();
      if (error) throw error;
      item = data;
    }

    // Recalculate cart totals
    await recalculateCart(cart_id);

    res.json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/cart/:cart_id/items/:product_id — remove item from cart
router.delete("/:cart_id/items/:product_id", async (req, res, next) => {
  try {
    const { cart_id, product_id } = req.params;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart_id)
      .eq("product_id", product_id);

    if (error) throw error;

    await recalculateCart(cart_id);

    res.json({ status: "success", message: "Item removed" });
  } catch (err) {
    next(err);
  }
});

// Helper: recalculate cart total_amount and tax_amount
async function recalculateCart(cart_id) {
  const { data: items } = await supabase
    .from("cart_items")
    .select("subtotal")
    .eq("cart_id", cart_id);

  const subtotal = items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0);
  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  await supabase
    .from("carts")
    .update({ total_amount: total, tax_amount: tax })
    .eq("cart_id", cart_id);
}

module.exports = router;
