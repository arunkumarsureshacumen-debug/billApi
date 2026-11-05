/**
 * Sails Bootstrap
 * (sails.config.bootstrap)
 *
 * Runs once just before the Sails application is lifted.
 *
 * ── 30-Day DC Stock Reminder ──────────────────────────────────────────────────
 * Every day at 9:00 AM the job runs and checks ALL DC entries.
 *
 * For each DC entry it:
 *   1. Calculates how many days have passed since the DC date.
 *   2. Skips the entry if fewer than 30 days have passed.
 *   3. Skips the entry if daysSince is NOT a multiple of 30
 *      (i.e. only fires on day 30, 60, 90, 120 …).
 *   4. Finds every RC entry for the same clientId and sums up the
 *      returned quantities per product.
 *   5. Computes what is still outstanding (DC qty − total returned qty).
 *   6. If NOTHING is outstanding → stock is fully returned → no email.
 *   7. If something is still outstanding → sends a reminder email
 *      showing the outstanding items via dcReminderMail.js.
 */

const sendDcReminderMail = require('../api/Services/dcReminderMail');
const EmailService = require('../api/Services/EmailService');

module.exports.bootstrap = async function () {

  // ── Core check function ────────────────────────────────────────────────────
  const checkAndSendReminders = async () => {
    try {
      sails.log.info('[DC Reminder] Daily stock reminder check started...');

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Fetch every DC entry (varientName === 'DC')
      const allDCs = await DcEntry.find({ varientName: 'DC' });

      if (!allDCs || allDCs.length === 0) {
        sails.log.info('[DC Reminder] No DC entries found. Nothing to check.');
        return;
      }

      for (const dc of allDCs) {
        // ── Step 1: Calculate days since DC date ────────────────────────────
        const dcDate = new Date(dc.date);
        dcDate.setHours(0, 0, 0, 0);

        const daysSince = Math.floor((today - dcDate) / (1000 * 60 * 60 * 24));

        // ── Step 2 & 3: Skip if < 30 days or not a multiple of 30 ──────────
        if (daysSince < 30 || daysSince % 30 !== 0) {
          continue;
        }

        sails.log.info(
          `[DC Reminder] Checking DC #${dc.DcNumber} (${dc.clientId} / ${dc.name}) — ${daysSince} days old`
        );

        // ── Step 4: Sum all RC returns for this client ─────────────────────
        const rcEntries = await DcEntry.find({
          clientId:    dc.clientId,
          varientName: 'RC',
        });

        // Build a map:  product → total returned quantity
        const returnedMap = {};
        for (const rc of rcEntries) {
          if (Array.isArray(rc.product) && Array.isArray(rc.Quantity)) {
            rc.product.forEach((prod, i) => {
              const qty = Number(rc.Quantity[i]) || 0;
              returnedMap[prod] = (returnedMap[prod] || 0) + qty;
            });
          }
        }

        // ── Step 5: Calculate outstanding quantities ────────────────────────
        const remainingProducts   = [];
        const remainingQuantities = [];

        if (Array.isArray(dc.product) && Array.isArray(dc.Quantity)) {
          for (let i = 0; i < dc.product.length; i++) {
            const prod      = dc.product[i];
            const dcQty     = Number(dc.Quantity[i]) || 0;
            const returned  = returnedMap[prod] || 0;
            const remaining = dcQty - returned;

            if (remaining > 0) {
              remainingProducts.push(prod);
              remainingQuantities.push(remaining);
            }
          }
        }

        // ── Step 6: Skip if fully returned ─────────────────────────────────
        if (remainingProducts.length === 0) {
          sails.log.info(
            `[DC Reminder] DC #${dc.DcNumber} (${dc.clientId}) — fully returned. No email sent.`
          );
          continue;
        }

        // ── Step 7: Send reminder with outstanding items ────────────────────
        try {
          await sendDcReminderMail(dc, remainingProducts, remainingQuantities, daysSince);
          sails.log.info(
            `[DC Reminder] ✅ Reminder sent for DC #${dc.DcNumber} — ${dc.name} ` +
            `(Day ${daysSince}, ${remainingProducts.length} item(s) still pending)`
          );
        } catch (mailErr) {
          sails.log.error(
            `[DC Reminder] ❌ Email failed for DC #${dc.DcNumber}:`,
            mailErr.message || mailErr
          );
          // Continue checking remaining DCs even if one email fails
        }
      }

      sails.log.info('[DC Reminder] Daily check complete.');

    } catch (err) {
      sails.log.error('[DC Reminder] Unexpected error:', err.message || err);
    }
  };

  // ── Scheduler: fire at 9:00 AM, then every 24 h ───────────────────────────
  const scheduleReminder = () => {
    const now    = new Date();
    const next9  = new Date(now);
    next9.setHours(9, 0, 0, 0);

    // If it's already past 9 AM push to tomorrow
    if (next9 <= now) {
      next9.setDate(next9.getDate() + 1);
    }

    const delay = next9 - now;
    sails.log.info(
      `[DC Reminder] Scheduled. First check at ${next9.toLocaleString()} ` +
      `(in ${Math.round(delay / 60000)} min)`
    );

    setTimeout(() => {
      checkAndSendReminders();                                  // first run
      setInterval(checkAndSendReminders, 24 * 60 * 60 * 1000); // repeat daily
    }, delay);
  };

  const scheduleDailyPipeStockSummary = () => {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(6, 30, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delay = nextRun - now;
    sails.log.info(
      `[PipeStock Daily] Scheduled next summary at ${nextRun.toLocaleString()} ` +
      `(in ${Math.round(delay / 60000)} min)`
    );

    setTimeout(() => {
      sendDailyPipeStockSummary();
      setInterval(sendDailyPipeStockSummary, 24 * 60 * 60 * 1000);
    }, delay);
  };

  const sendDailyPipeStockSummary = async () => {
    try {
      sails.log.info('[PipeStock Daily] Preparing daily PipeStock summary email...');
      const pipeStocks = await PipeStock.find();

      if (!pipeStocks || pipeStocks.length === 0) {
        sails.log.info('[PipeStock Daily] No PipeStock records found. Skipping email.');
        return;
      }

      await EmailService.sendPipeStockWeeklyReport(pipeStocks);
      sails.log.info(`[PipeStock Daily] Summary email sent for ${pipeStocks.length} PipeStock item(s).`);
    } catch (err) {
      sails.log.error('[PipeStock Daily] Failed to send daily summary:', err.message || err);
    }
  };

  const scheduleDailyDatabaseBackup = () => {
    const now = new Date();
    const nextRun = new Date(now);
    nextRun.setHours(23, 0, 0, 0);

    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1);
    }

    const delay = nextRun - now;
    sails.log.info(
      `[Database Backup] Scheduled next backup at ${nextRun.toLocaleString()} ` +
      `(in ${Math.round(delay / 60000)} min)`
    );

    setTimeout(() => {
      sendDailyDatabaseBackup();
      setInterval(sendDailyDatabaseBackup, 24 * 60 * 60 * 1000);
    }, delay);
  };

  const sendDailyDatabaseBackup = async () => {
    try {
      sails.log.info('[Database Backup] Preparing daily backup email...');
      await EmailService.sendDatabaseBackupEmail();
      sails.log.info('[Database Backup] Daily backup email sent successfully.');
    } catch (err) {
      sails.log.error('[Database Backup] Failed to send daily backup:', err.message || err);
    }
  };

  scheduleReminder();
  scheduleDailyPipeStockSummary();
  scheduleDailyDatabaseBackup();
};
