const { MongoClient } = require('./node_modules/mongodb');
const PDFDocument = require('pdfkit');
const fs = require('fs');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

function formatProducts(dc) {
  const products = Array.isArray(dc.product) ? dc.product : [dc.product];
  const qtyArr = Array.isArray(dc.Quantity) ? dc.Quantity : [dc.Quantity];
  return products.map((p, i) => `${p} - ${qtyArr[i] ?? 0}`).join(', ');
}

function calculateBalance(dcList) {
  const balance = {};
  dcList.forEach(entry => {
    const type = (entry.varientName || '').trim().toUpperCase();
    const products = Array.isArray(entry.product) ? entry.product : [entry.product];
    const qtyArr = Array.isArray(entry.Quantity) ? entry.Quantity : [entry.Quantity];
    products.forEach((prod, i) => {
      const qty = Number(qtyArr[i]) || 0;
      if (!balance[prod]) balance[prod] = 0;
      if (type === 'DC') balance[prod] += qty;
      else if (type === 'RC') balance[prod] -= qty;
    });
  });
  return balance;
}

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');

  const clients = await db.collection('clientlist').find({}).sort({ clientId: 1 }).toArray();
  const allDc = await db.collection('dcentry').find({}).toArray();
  const dcMap = {};
  allDc.forEach(d => { dcMap[d._id.toString()] = d; });

  console.log(`Clients: ${clients.length}, DcEntry: ${allDc.length}`);

  const doc = new PDFDocument({ margin: 14, size: 'A4' });
  const stream = fs.createWriteStream('/Users/acumen/Documents/server/yohalashmi/billApi/All_Clients_Stock_Report.pdf');
  doc.pipe(stream);

  const pw = doc.page.width - 28;
  const m = 14;
  let pageNum = 0;

  function drawHeader() {
    doc.fontSize(8).fillColor('#555');
    doc.text('GSTIN: 33FNTPS8310A1ZW', m, 10);
    doc.text('Annai Adhi Parasakthi Thunai', pw - 120, 10, { width: 120, align: 'center' });
    doc.text('Ph: 9884968326 / 7200509005', pw - 10, 10, { align: 'right' });

    doc.fontSize(18).fillColor('#c40000').font('Helvetica-Bold');
    doc.text('YOHALAKSHMI ENTERPRISES', m, 20, { align: 'center', width: pw });

    doc.fontSize(10).fillColor('#222').font('Helvetica-Bold');
    doc.text('SCAFFOLDING & LABOUR SHED CONTRACTOR', m, 36, { align: 'center', width: pw });

    doc.fontSize(9).fillColor('#555').font('Helvetica');
    doc.text('NO 40/B, PILLAYAR KOIL STREET, PUTHAGARAM, CHENNAI - 99', m, 48, { align: 'center', width: pw });
    doc.text('E-MAIL: yohalakshmienterprises@gmail.com', m, 59, { align: 'center', width: pw });

    doc.moveTo(m, 68).lineTo(m + pw, 68).strokeColor('#c40000').lineWidth(2).stroke();
    return 75;
  }

  for (const [ci, cl] of clients.entries()) {
    if (ci > 0) doc.addPage();

    let y = drawHeader() + 4;

    const dcEntries = allDc
      .filter(dc => dc.clientId === cl.clientId)
      .sort((a, b) => new Date(a.date) - new Date(b.date) || (a.DcNumber || '').localeCompare(b.DcNumber || ''));

    const balance = calculateBalance(dcEntries);

    doc.fontSize(11).fillColor('#1e293b').font('Helvetica-Bold');
    doc.text(`${cl.name || ''}  |  ${cl.clientId}`, m, y);
    y += 14;

    if (cl.address) {
      doc.fontSize(9).fillColor('#555').font('Helvetica');
      doc.text(`Address: ${cl.address}`, m, y);
      y += 11;
    }

    doc.fontSize(9).fillColor('#555');
    doc.text(`Total Entries: ${dcEntries.length}`, m, y);
    y += 9;

    doc.moveTo(m, y).lineTo(m + pw, y).strokeColor('#dcdcdc').lineWidth(1).stroke();
    y += 8;

    if (dcEntries.length) {
      const colW = [10, 26, 22, 24, pw - 82];
      const colX = [m, m + 10, m + 36, m + 58, m + 82];

      doc.rect(m, y, pw, 10).fill('#f1f5f9');
      doc.fontSize(9).fillColor('#1e293b').font('Helvetica-Bold');
      const headers = ['#', 'Date', 'Type', 'Actual DC#', 'Products & Qty'];
      headers.forEach((h, i) => doc.text(h, colX[i] + 2, y + 2));
      y += 12;

      doc.font('Helvetica');
      for (const [idx, dc] of dcEntries.entries()) {
        const prodStr = formatProducts(dc);
        const cells = [`${idx + 1}`, dc.date || '', dc.varientName || '', dc.ActualDcNumber || '', prodStr];
        const heights = cells.map((c, i) => doc.heightOfString(String(c), { width: colW[i] - 3, fontSize: 8.5 }));
        const rowH = Math.max(10, Math.max(...heights) + 4);
        if (y + rowH > doc.page.height - 20) { doc.addPage(); y = drawHeader() + 4; }
        const even = idx % 2 === 0;
        doc.rect(m, y, pw, rowH).fill(even ? '#ffffff' : '#f8fafc');
        cells.forEach((cell, i) => {
          if (i === 2) {
            if (cell === 'DC') doc.fillColor('#e11d48');
            else if (cell === 'RC') doc.fillColor('#10b981');
            else doc.fillColor('#6366f1');
          } else {
            doc.fillColor('#323232');
          }
          doc.fontSize(8.5);
          doc.text(String(cell), colX[i] + 2, y + 2, { width: colW[i] - 3, lineBreak: true });
        });
        y += rowH;
      }

      y += 8;
    } else {
      doc.fontSize(9).fillColor('#a0a0a0');
      doc.text('No DC/RC entries', m + 4, y + 2);
      y += 16;
    }

    if (y + 20 > doc.page.height - 10) { doc.addPage(); y = drawHeader() + 4; }
    doc.moveTo(m, y).lineTo(m + pw, y).strokeColor('#c8c8c8').lineWidth(1).stroke();
    y += 10;

    doc.fontSize(10).fillColor('#1e293b').font('Helvetica-Bold');
    doc.text('Stock Balance', m, y);
    y += 10;

    const bKeys = Object.keys(balance);
    if (bKeys.length) {
      doc.fontSize(9).font('Helvetica');
      for (const prod of bKeys) {
        if (y + 10 > doc.page.height - 10) { doc.addPage(); y = drawHeader() + 4; }
        doc.fillColor('#323232');
        doc.text(prod, m + 4, y);
        const qty = balance[prod];
        doc.fillColor(qty >= 0 ? '#16a34a' : '#dc2626');
        doc.text(String(qty), m + pw, y, { align: 'right' });
        y += 9;
      }
    } else {
      doc.fontSize(9).fillColor('#a0a0a0');
      doc.text('No stock balance', m + 4, y + 1);
      y += 10;
    }
  }

  doc.end();
  stream.on('finish', () => {
    console.log('PDF generated: All_Clients_Stock_Report.pdf');
    client.close();
  });
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
