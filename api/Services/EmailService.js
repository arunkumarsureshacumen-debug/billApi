const nodemailer = require("nodemailer");

module.exports = {
  sendBillMail: async function (payment) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [process.env.GMAIL_USER, "yohalakshmienterprises@gmail.com"],
      subject: "New Payment Received",

      html: `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#eef2f7; padding:30px 15px;">

  <style>
    @keyframes glow {
      0% {box-shadow:0 0 10px rgba(0,123,255,0.2);}
      50% {box-shadow:0 0 25px rgba(0,123,255,0.5);}
      100% {box-shadow:0 0 10px rgba(0,123,255,0.2);}
    }

    @keyframes fadeIn {
      from {opacity:0; transform:translateY(10px);}
      to {opacity:1; transform:translateY(0);}
    }
  </style>

  <div style="
      max-width:620px;
      margin:auto;
      background:#ffffff;
      border-radius:14px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(0,0,0,0.15);
      animation:fadeIn 0.8s ease;
  ">

    <!-- Header -->
    <div style="
      background:linear-gradient(135deg,#2563eb,#9333ea);
      padding:30px;
      text-align:center;
      color:white;
    ">
    
      <img 
        src="https://cdn.shopify.com/s/files/1/0973/6405/0286/files/yllogo-modified.png?v=1771331243"
        style="width:90px; margin-bottom:10px; border-radius:50%; background:white; padding:6px;"
      />

      <h2 style="margin:5px 0 5px; letter-spacing:1px;">
        YOHALAKSHMI ENTERPRISES
      </h2>

      <p style="margin:0; font-size:14px; opacity:0.9;">
        Payment Confirmation
      </p>

    </div>


    <!-- Content -->
    <div style="padding:25px 30px;">

      <h3 style="margin-bottom:18px; color:#111827;">
        Payment Details
      </h3>

      <table width="100%" cellpadding="0" cellspacing="0" style="
        border-collapse:collapse;
        font-size:14px;
        border-radius:8px;
        overflow:hidden;
      ">

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Client</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.clientID}</td>
        </tr>

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Construction</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.constructionName}</td>
        </tr>

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Approx Area</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.approximateArea}</td>
        </tr>

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Running Sqft</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.runningSqft}</td>
        </tr>

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Approx Sqft</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.approximateSoft}</td>
        </tr>

        <tr>
          <td style="padding:12px;background:#f8fafc;border:1px solid #e5e7eb;"><b>Date</b></td>
          <td style="padding:12px;border:1px solid #e5e7eb;">${payment.date}</td>
        </tr>

      </table>


      <!-- Amount Highlight -->
      <div style="
        margin-top:25px;
        text-align:center;
        padding:20px;
        background:#f0fdf4;
        border:1px solid #bbf7d0;
        border-radius:10px;
        animation:glow 3s infinite;
      ">
        <p style="margin:0;font-size:14px;color:#065f46;">
          Amount Received
        </p>

        <h2 style="
          margin:5px 0 0;
          color:#16a34a;
          font-size:28px;
          letter-spacing:1px;
        ">
          ₹${payment.Amount}
        </h2>
      </div>

    </div>


    <!-- Footer -->
    <div style="
      background:#f9fafb;
      text-align:center;
      padding:15px;
      font-size:12px;
      color:#6b7280;
    ">
      © ${new Date().getFullYear()} Yohalakshmi Enterprises <br>
      Developed By AK • Automated Payment Notification
    </div>

  </div>

</div>
`
    };

    await transporter.sendMail(mailOptions);
  },
  sendPaymentMail: async function (payment) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [process.env.GMAIL_USER, "yohalakshmienterprises@gmail.com"],
      subject: "New Payment Received",
      html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 14px rgba(0,0,0,0.12);">
      
      <!-- Logo Section -->
      <div style="text-align:center; padding:20px 20px 10px;">
        <img 
          src="https://cdn.shopify.com/s/files/1/0973/6405/0286/files/yllogo-modified.png?v=1771331243"
          alt="SAKTHI ENTERPRISES"
          style="max-width:120px; height:auto;"
        />
      </div>

      <!-- Header -->
      <div style="text-align:center; padding:5px 20px 20px;">
        <h2 style="margin:0; color:#1f2937; letter-spacing:0.5px;">
          YOHALAKSHMI ENTERPRISES
        </h2>
        <p style="margin:6px 0 0; font-size:13px; color:#6b7280;">
          Payment Confirmation
        </p>
      </div>

      <!-- Body -->
      <div style="padding:20px;">
        <h3 style="margin-bottom:15px; color:#111827;">
          Payment Details
        </h3>

        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Client</b></td>
            <td style="padding:10px; border:1px solid #e5e7eb;">${payment.clientID}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Construction</b></td>
            <td style="padding:10px; border:1px solid #e5e7eb;">${payment.constructionName}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Method</b></td>
            <td style="padding:10px; border:1px solid #e5e7eb;">${payment.Method}</td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Amount</b></td>
            <td style="padding:10px; border:1px solid #e5e7eb; color:#16a34a; font-weight:bold;">
              ₹${payment.Amount}
            </td>
          </tr>

          <tr>
            <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Date</b></td>
            <td style="padding:10px; border:1px solid #e5e7eb;">${payment.date}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; text-align:center; padding:12px; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} Developed By AK • This is an automated email
      </div>

    </div>
  </div>
`
    };

    await transporter.sendMail(mailOptions);
  },

  sendDcMail: async function (payment) {

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    /* ✅ Build Product / Quantity rows */
    let productRows = "";

    if (Array.isArray(payment.product) && Array.isArray(payment.quantity)) {
      payment.product.forEach((prod, index) => {
        productRows += `
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb;">
            ${prod}
          </td>
          <td style="padding:10px; border:1px solid #e5e7eb; text-align:center; font-weight:bold;">
            ${payment.quantity[index]}
          </td>
        </tr>
      `;
      });
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [
        process.env.GMAIL_USER,
        "yohalakshmienterprises@gmail.com"
      ],
      subject: `${payment.varient && payment.varient.toLowerCase() === 'rc' ? 'RC' : 'DC'} Generated - ${payment.dcNumber}`,
      html: `
<div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; box-shadow:0 4px 14px rgba(0,0,0,0.12);">

    <!-- Logo -->
    <div style="text-align:center; padding:20px;">
      <img src="https://cdn.shopify.com/s/files/1/0973/6405/0286/files/yllogo-modified.png?v=1771331243" alt="Logo"
           style="max-width:120px;" />
    </div>

    <!-- Header -->
    <div style="text-align:center;">
      <h2 style="margin:0; color:#1f2937;">YOHALAKSHMI ENTERPRISES</h2>
      <p style="font-size:13px; color:#6b7280;">Delivery / Return Challan</p>
    </div>

    <!-- Details -->
    <div style="padding:20px;">
      <table width="100%" style="border-collapse:collapse; font-size:14px;">
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Client</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.clientID}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Construction</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.constructionName}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Variant</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.varient}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>${payment.varient && payment.varient.toLowerCase() === 'rc' ? 'RC Number' : 'DC Number'}</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.dcNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>${payment.varient && payment.varient.toLowerCase() === 'rc' ? 'RC Note Number' : 'DC Note Number'}</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.actualDcNumber}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Vehicle</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.vehicle}</td>
        </tr>
        <tr>
          <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Date</b></td>
          <td style="padding:10px; border:1px solid #e5e7eb;">${payment.date}</td>
        </tr>
      </table>

      <!-- Product Table -->
      <h3 style="margin-top:20px; color:#111827;">Products</h3>
      <table width="100%" style="border-collapse:collapse; font-size:14px;">
        <tr style="background:#f3f4f6;">
          <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Product</th>
          <th style="padding:10px; border:1px solid #e5e7eb;">Quantity</th>
        </tr>
        ${productRows}
      </table>

    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; text-align:center; padding:12px; font-size:12px; color:#6b7280;">
      © ${new Date().getFullYear()} yohalakshmi Enterprises • Developed by AK
    </div>

  </div>
</div>
`
    };

    await transporter.sendMail(mailOptions);
  },

  sendPipeStockWeeklyReport: async function (pipeStocks) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    const stockRows = pipeStocks.map(stock => `
      <tr>
        <td style="padding:12px; border:1px solid #e5e7eb;">${stock.item_code}</td>
        <td style="padding:12px; border:1px solid #e5e7eb; text-align:center;">${stock.quantity}</td>
        <td style="padding:12px; border:1px solid #e5e7eb; text-align:center;">${stock.status}</td>
      </tr>
    `).join('');

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [
        process.env.GMAIL_USER,
        "yohalakshmienterprises@gmail.com"
      ],
      subject: "Daily PipeStock Summary",
      html: `
<div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
<div style="text-align:center; padding:20px;">
      <img src="https://cdn.shopify.com/s/files/1/0973/6405/0286/files/yllogo-modified.png?v=1771331243" alt="Logo"
           style="max-width:120px;" />
    </div>
  <div style="max-width:700px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.12);">
    <div style="background:linear-gradient(135deg,#2563eb,#9333ea); color:#ffffff; padding:24px; text-align:center;">
      <h1 style="margin:0; font-size:24px;">Daily PipeStock Summary</h1>
      <p style="margin:8px 0 0; font-size:14px; opacity:0.85;">Current pipe stock details as of ${new Date().toLocaleDateString()}</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 18px; color:#111827; font-size:15px;">
        Here is the current PipeStock inventory snapshot.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
        <thead>
          <tr style="background:#f3f4f6; text-align:left;">
            <th style="padding:12px; border:1px solid #e5e7eb;">Item Code</th>
            <th style="padding:12px; border:1px solid #e5e7eb; text-align:center;">Quantity</th>
            <th style="padding:12px; border:1px solid #e5e7eb; text-align:center;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${stockRows}
        </tbody>
      </table>
      <p style="margin:20px 0 0; color:#6b7280; font-size:13px;">This email is sent daily as a PipeStock report.</p>
    </div>
    <div style="background:#f9fafb; text-align:center; padding:14px; color:#6b7280; font-size:12px;">
      © ${new Date().getFullYear()} Yohalakshmi Enterprises • Automated daily stock report-developed by AK
    </div>
  </div>
</div>
      `
    };

    await transporter.sendMail(mailOptions);
  },

  sendDatabaseBackupEmail: async function () {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const modelNames = [
      'BillLogin', 'ClientList', 'Quotation', 'DcEntry',
      'DataSaveUrl', 'SiteWork', 'Payment', 'PipeStock',
      'Original', 'AddSupplier', 'Supplier', 'Expense',
      'Transport', 'SelfPay'
    ];

    const dateStr = new Date().toISOString().slice(0, 10);
    const attachments = [];
    let totalRecords = 0;

    for (const modelName of modelNames) {
      try {
        const Model = sails.models[modelName.toLowerCase()];
        if (!Model) continue;

        const records = await Model.find();
        const json = JSON.stringify(records, null, 2);

        attachments.push({
          filename: `${modelName}_${dateStr}.json`,
          content: json,
          contentType: 'application/json'
        });

        totalRecords += records.length;
      } catch (err) {
        sails.log.error(`[Backup] Failed to fetch ${modelName}:`, err.message);
      }
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: [
        process.env.GMAIL_USER
      ],
      subject: `Daily Database Backup — ${dateStr} (${totalRecords} records)`,
      html: `
<div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.12);">
    <div style="background:linear-gradient(135deg,#2563eb,#9333ea); color:#ffffff; padding:24px; text-align:center;">
      <h1 style="margin:0; font-size:22px;">Daily Database Backup</h1>
      <p style="margin:8px 0 0; font-size:13px; opacity:0.85;">${dateStr}</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px; color:#111827; font-size:14px;">
        Backup contains <strong>${totalRecords}</strong> records across <strong>${attachments.length}</strong> tables.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; font-size:13px;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px; border:1px solid #e5e7eb; text-align:left;">Table</th>
            <th style="padding:10px; border:1px solid #e5e7eb; text-align:center;">Records</th>
          </tr>
        </thead>
        <tbody>
          ${attachments.map(a => `<tr><td style="padding:8px; border:1px solid #e5e7eb;">${a.filename.replace('_' + dateStr + '.json', '')}</td><td style="padding:8px; border:1px solid #e5e7eb; text-align:center;">${JSON.parse(a.content).length}</td></tr>`).join('')}
        </tbody>
      </table>
      <p style="margin:20px 0 0; color:#6b7280; font-size:12px;">
        All tables are attached as JSON files. This email is sent automatically every day.
      </p>
    </div>
    <div style="background:#f9fafb; text-align:center; padding:14px; color:#6b7280; font-size:12px;">
      © ${new Date().getFullYear()} Yohalakshmi Enterprises • Automated daily backup
    </div>
  </div>
</div>
      `,
      attachments: attachments
    };

    await transporter.sendMail(mailOptions);
  },

};
