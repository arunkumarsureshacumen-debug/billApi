/**
 * restore-mongo.js
 * Insert DcEntry records directly into MongoDB Atlas.
 * Usage: /usr/local/bin/node restore-mongo.js
 */
const { MongoClient } = require('./node_modules/mongodb');
const data = require('./dcentry-data.json');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const col = db.collection('dcentry');

  // Check existing count
  const existing = await col.countDocuments();
  console.log('Existing DcEntry records:', existing);

  // Check if collection exists
  const cols = await db.listCollections({ name: 'dcentry' }).toArray();
  console.log('Collection exists:', cols.length > 0);

  // Convert id -> _id for MongoDB
  const docs = data.map(r => ({
    _id: r.id,
    date: r.date,
    varientName: r.varientName,
    name: r.name,
    clientId: r.clientId || '',
    product: r.product,
    Quantity: r.Quantity,
    vehicleNumber: r.vehicleNumber || '',
    DcNumber: r.DcNumber || '',
    ActualDcNumber: r.ActualDcNumber || '',
    client: r.client || null,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  }));

  // Insert in batches
  const batchSize = 100;
  let inserted = 0;
  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);
    try {
      const result = await col.insertMany(batch, { ordered: false });
      inserted += result.insertedCount;
      console.log(`Batch ${i/batchSize + 1}: inserted ${result.insertedCount}`);
    } catch (e) {
      if (e.code === 11000) {
        // Duplicate key - still count them
        const successful = e.insertedDocs ? e.insertedDocs.length : 0;
        inserted += successful;
        console.log(`Batch ${i/batchSize + 1}: ${successful} inserted (some duplicates skipped)`);
      } else {
        console.error(`Batch ${i/batchSize + 1} error:`, e.message);
      }
    }
  }

  const total = await col.countDocuments();
  console.log(`\nDone. Inserted: ${inserted}, Total in collection: ${total}`);
  await client.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
