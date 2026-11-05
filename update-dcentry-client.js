const { MongoClient } = require('./node_modules/mongodb');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const dcCol = db.collection('dcentry');

  // Get all DcEntry records
  const dcRecords = await dcCol.find({}).toArray();
  console.log(`Found ${dcRecords.length} DcEntry records to update`);

  let updated = 0;
  let skipped = 0;

  for (const doc of dcRecords) {
    const cid = doc.clientId;
    if (!cid) {
      skipped++;
      continue;
    }
    const newClientId = `client_${cid.toLowerCase()}`;
    const result = await dcCol.updateOne(
      { _id: doc._id },
      { $set: { client: newClientId } }
    );
    if (result.modifiedCount > 0) updated++;
  }

  console.log(`Updated: ${updated}, Skipped (no clientId): ${skipped}`);

  // Verify
  const sample = await dcCol.find({}).limit(3).toArray();
  console.log('\nSample records after update:');
  sample.forEach(d => console.log(`${d.date}\t${d.clientId}\t->\t${d.client}`));

  await client.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
