const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const supabase = require("../config/supabase");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/v1/checkout/order — create Razorpay order
router.post("/order", async (req, res, next) => {
  try {
    const { cart_id } = req.body;

    if (!cart_id) {
      return res.status(400).json({ status: "error", message: "cart_id is required" });
    }

    const { data: cart, error } = await supabase
      .from("carts")
      .select("total_amount, customer_id")
      .eq("cart_id", cart_id)
      .single();

    if (error || !cart) {
      return res.status(404).json({ status: "error", message: "Cart not found" });
    }

    if (cart.total_amount <= 0) {
      return res.status(400).json({ status: "error", message: "Cart is empty" });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const order = await razorpay.orders.create({
      amount: Math.round(cart.total_amount * 100),
      currency: "INR",
      receipt: `cart_${cart_id}`,
      notes: { cart_id, customer_id: cart.customer_id },
    });

    res.json({
      status: "success",
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/checkout/verify — verify Razorpay payment signature & save payment record
router.post("/verify", async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart_id,
      customer_id,
      payment_method,
    } = req.body;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: "error", message: "Invalid payment signature" });
    }

    // Fetch cart total
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("total_amount")
      .eq("cart_id", cart_id)
      .single();

    if (cartError || !cart) {
      return res.status(404).json({ status: "error", message: "Cart not found" });
    }

    // Save payment record (no card details stored — only gateway IDs)
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert([{
        cart_id,
        amount: cart.total_amount,
        payment_status: "success",
        payment_method: payment_method || "razorpay",
        razorpay_order_id,
        razorpay_payment_id,
      }])
      .select()
      .single();

    if (paymentError) throw paymentError;

    res.json({ status: "success", data: { payment_id: payment.payment_id, cart_id, customer_id } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
