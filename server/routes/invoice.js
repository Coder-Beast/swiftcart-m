const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../config/supabase");

// POST /api/v1/invoice/generate — generate invoice + exit QR after successful payment
router.post("/generate", async (req, res, next) => {
  try {
    const { payment_id, customer_id } = req.body;

    if (!payment_id || !customer_id) {
      return res.status(400).json({ status: "error", message: "payment_id and customer_id are required" });
    }

    // Fetch payment
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("amount, payment_status, cart_id")
      .eq("payment_id", payment_id)
      .single();

    if (paymentError || !payment) {
      return res.status(404).json({ status: "error", message: "Payment not found" });
    }

    if (payment.payment_status !== "success") {
      return res.status(400).json({ status: "error", message: "Payment not successful" });
    }

    // Generate cryptographically secure Exit QR payload
    const expiresAt = new Date(Date.now() + parseInt(process.env.QR_EXPIRY_MINUTES || 15) * 60 * 1000);
    const token = uuidv4();
    const payload = `${payment_id}:${customer_id}:${expiresAt.toISOString()}:${token}`;
    const exitQrCode = crypto
      .createHmac("sha256", process.env.QR_SECRET || "default_secret")
      .update(payload)
      .digest("hex");

    // Save invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert([{
        payment_id,
        customer_id,
        total_amount: payment.amount,
        exit_qr_code: exitQrCode,
        qr_expires_at: expiresAt.toISOString(),
        qr_token: token,
        verification_status: "unused",
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Fetch cart items for the receipt
    const { data: items } = await supabase
      .from("cart_items")
      .select("quantity, subtotal, products(product_name, price)")
      .eq("cart_id", payment.cart_id);

    res.status(201).json({
      status: "success",
      data: {
        invoice_id: invoice.invoice_id,
        total_amount: invoice.total_amount,
        invoice_date: invoice.invoice_date,
        exit_qr_code: exitQrCode,
        qr_expires_at: expiresAt,
        items,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/invoice/:invoice_id — get invoice details
router.get("/:invoice_id", async (req, res, next) => {
  try {
    const { invoice_id } = req.params;

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("invoice_id", invoice_id)
      .single();

    if (error || !data) {
      return res.status(404).json({ status: "error", message: "Invoice not found" });
    }

    res.json({ status: "success", data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
