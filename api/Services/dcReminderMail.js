'use strict';

/**
 * dcReminderMail.js
 * Sends a stock return reminder email for a DC entry that hasn't been fully returned.
 *
 * @param {Object}   dcEntry             - The DC entry from MongoDB
 * @param {string[]} remainingProducts   - Products still pending return
 * @param {number[]} remainingQuantities - Pending quantity per product
 * @param {number}   daysSince           - Days elapsed since DC date
 */
const nodemailer = require('nodemailer');

module.exports = async function sendDcReminderMail(dcEntry, remainingProducts, remainingQuantities, daysSince) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // ── Build original dispatch summary rows ──────────────────────────────────
  let originalRows = '';
  if (Array.isArray(dcEntry.product) && Array.isArray(dcEntry.Quantity)) {
    dcEntry.product.forEach(function(prod, i) {
      const dcQty  = Number(dcEntry.Quantity[i]) || 0;
      const remIdx = remainingProducts.indexOf(prod);
      const remQty = remIdx >= 0 ? Number(remainingQuantities[remIdx]) || 0 : 0;
      const done   = remQty <= 0;

      originalRows += [
        '<tr>',
        '  <td style="padding:10px; border:1px solid #e5e7eb;' + (done ? 'color:#9ca3af; text-decoration:line-through;' : '') + '">' + prod + '</td>',
        '  <td style="padding:10px; border:1px solid #e5e7eb; text-align:center;">' + dcQty + '</td>',
        '  <td style="padding:10px; border:1px solid #e5e7eb; text-align:center; font-weight:bold; color:' + (done ? '#16a34a' : '#dc2626') + ';">',
        done ? '&#10003; Returned' : (remQty + ' pending'),
        '  </td>',
        '</tr>',
      ].join('\n');
    });
  }

  // ── Build outstanding items rows ──────────────────────────────────────────
  let outstandingRows = '';
  remainingProducts.forEach(function(prod, i) {
    outstandingRows += [
      '<tr>',
      '  <td style="padding:10px; border:1px solid #fca5a5; color:#dc2626; font-weight:bold;">' + prod + '</td>',
      '  <td style="padding:10px; border:1px solid #fca5a5; text-align:center; font-weight:bold; color:#dc2626;">' + remainingQuantities[i] + '</td>',
      '</tr>',
    ].join('\n');
  });

  const daysLabel  = daysSince + ' Day' + (daysSince === 1 ? '' : 's');
  const year       = new Date().getFullYear();

  const htmlBody = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
<div style="padding:20px;">
  <div style="max-width:640px;margin:auto;background:#fff;border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,.12);">

    <!-- Logo -->
    <div style="text-align:center;padding:20px;">
      <img src="https://cdn.shopify.com/s/files/1/0973/6405/0286/files/yllogo-modified.png?v=1771331243"
           alt="Logo" style="max-width:110px;" />
    </div>

    <!-- Title -->
    <div style="text-align:center;padding:0 20px 10px;">
      <h2 style="margin:0;color:#1f2937;">YOHALAKSHMI ENTERPRISES</h2>
      <p style="font-size:13px;color:#6b7280;margin:4px 0 0;">Stock Return Reminder</p>
    </div>

    <!-- Red Banner -->
    <div style="margin:0 20px 20px;background:linear-gradient(135deg,#ef4444,#b91c1c);border-radius:8px;padding:16px 20px;text-align:center;color:#fff;">
      <p style="margin:0;font-size:16px;font-weight:bold;">&#9200; ${daysLabel} — Stock Not Fully Returned</p>
      <p style="margin:8px 0 0;font-size:13px;opacity:.9;">
        DC dated <strong>${dcEntry.date}</strong> for <strong>${dcEntry.name}</strong>
        has been outstanding for <strong>${daysSince} days</strong>.<br>
        Some materials have <strong>not been returned</strong> yet. Please follow up immediately.
      </p>
    </div>

    <div style="padding:0 20px 20px;">

      <!-- DC Details -->
      <table width="100%" style="border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>Client ID</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${dcEntry.clientId}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>Construction</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${dcEntry.name}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>DC Number</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${dcEntry.DcNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>Vehicle</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;">${dcEntry.vehicleNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>DC Date</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;"><b style="color:#dc2626;">${dcEntry.date}</b></td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #e5e7eb;background:#f9fafb;"><b>Days Outstanding</b></td>
          <td style="padding:10px;border:1px solid #e5e7eb;"><b style="color:#dc2626;">${daysSince} days</b></td>
        </tr>
      </table>

      <!-- Original Dispatch Summary -->
      <h3 style="margin-top:22px;color:#111827;">&#128230; Original Dispatch Summary</h3>
      <table width="100%" style="border-collapse:collapse;font-size:14px;">
        <tr style="background:#f3f4f6;">
          <th style="padding:10px;border:1px solid #e5e7eb;text-align:left;">Product</th>
          <th style="padding:10px;border:1px solid #e5e7eb;">Dispatched Qty</th>
          <th style="padding:10px;border:1px solid #e5e7eb;">Return Status</th>
        </tr>
        ${originalRows}
      </table>

      <!-- Still Outstanding -->
      <h3 style="margin-top:22px;color:#dc2626;">&#128308; Still Outstanding (Pending RC)</h3>
      <table width="100%" style="border-collapse:collapse;font-size:14px;">
        <tr style="background:#fef2f2;">
          <th style="padding:10px;border:1px solid #fca5a5;text-align:left;color:#dc2626;">Product</th>
          <th style="padding:10px;border:1px solid #fca5a5;color:#dc2626;">Qty to Return</th>
        </tr>
        ${outstandingRows}
      </table>

    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6;text-align:center;padding:12px;font-size:12px;color:#6b7280;">
      &copy; ${year} Yohalakshmi Enterprises &bull; Automated Stock Reminder &bull; Developed by AK
    </div>

  </div>
</div>
</body>
</html>
`;

  await transporter.sendMail({
    from:    process.env.GMAIL_USER,
    to:      [process.env.GMAIL_USER, 'yohalakshmienterprises@gmail.com'],
    subject: '\u23F0 Stock Pending (' + daysLabel + ') \u2014 DC #' + dcEntry.DcNumber + ' | ' + dcEntry.name,
    html:    htmlBody,
  });
};
