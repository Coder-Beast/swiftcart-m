const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// POST /api/v1/verify — security guard scans Exit QR code
router.post("/", async (req, res, next) => {
  try {
    const { exit_qr_code } = req.body;

    if (!exit_qr_code) {
      return res.status(400).json({ status: "error", message: "exit_qr_code is required" });
    }

    const { data: invoice, error } = await supabase
      .from("invoices")
      .select("invoice_id, total_amount, invoice_date, verification_status, qr_expires_at, customer_id")
      .eq("exit_qr_code", exit_qr_code)
      .single();

    if (error || !invoice) {
      return res.status(404).json({
        status: "invalid",
        message: "QR code not found or invalid",
      });
    }

    // Check expiry
    if (new Date() > new Date(invoice.qr_expires_at)) {
      return res.status(400).json({
        status: "invalid",
        message: "QR code has expired",
        invoice_id: invoice.invoice_id,
      });
    }

    // Check if already used
    if (invoice.verification_status === "used") {
      return res.status(400).json({
        status: "already_used",
        message: "This QR code has already been scanned",
        invoice_id: invoice.invoice_id,
      });
    }

    // Mark as used
    await supabase
      .from("invoices")
      .update({ verification_status: "used", verified_at: new Date().toISOString() })
      .eq("invoice_id", invoice.invoice_id);

    res.json({
      status: "valid",
      message: "Payment verified. Customer may exit.",
      data: {
        invoice_id: invoice.invoice_id,
        total_amount: invoice.total_amount,
        invoice_date: invoice.invoice_date,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
