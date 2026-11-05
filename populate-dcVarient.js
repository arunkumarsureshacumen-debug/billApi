const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const dcCol = db.collection('dcentry');
  const clCol = db.collection('clientlist');

  // Group DcEntry IDs by clientId
  const dcEntries = await dcCol.find({}).toArray();
  const dcByClient = {};
  for (const dc of dcEntries) {
    const cid = dc.clientId;
    if (!cid) continue;
    if (!dcByClient[cid]) dcByClient[cid] = [];
    dcByClient[cid].push(dc._id.toString());
  }

  console.log(`Found DcEntry records for ${Object.keys(dcByClient).length} unique clientIds\n`);

  // Update each ClientList with matching DcEntry IDs
  let updated = 0;
  for (const [cid, ids] of Object.entries(dcByClient)) {
    const result = await clCol.updateOne(
      { clientId: cid },
      { $set: { dcVarient: ids } }
    );
    if (result.modifiedCount > 0 || result.upsertedCount > 0) {
      updated++;
      console.log(`${cid}: ${ids.length} DcEntry IDs`);
    }
  }

  console.log(`\nUpdated ${updated} ClientList records`);

  // Verify a sample
  const sample = await clCol.findOne({ clientId: 'YL2526064' });
  console.log(`\nYL2526064 dcVarient count: ${sample?.dcVarient?.length || 0}`);
  console.log('First 3 IDs:', sample?.dcVarient?.slice(0, 3));

  await client.close();
}
run().catch(e => { console.error('Fatal:', e); process.exit(1); });
