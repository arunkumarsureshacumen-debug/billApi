const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');

  // Build clientId -> { company, address } lookup
  const clients = await db.collection('clientlist').find({ clientId: { $ne: '' } }).toArray();
  const map = {};
  for (const c of clients) {
    map[c.clientId] = { company: c.company || '', address: c.address || '' };
  }

  // Use bulkWrite for speed
  const siteworks = await db.collection('sitework').find({}).toArray();
  const ops = [];
  for (const sw of siteworks) {
    const info = map[sw.clientId];
    if (!info) continue;
    ops.push({
      updateOne: {
        filter: { _id: sw._id },
        update: { $set: { constructionName: info.company, place: info.address } }
      }
    });
  }

  if (ops.length) {
    const result = await db.collection('sitework').bulkWrite(ops);
    console.log(`Matched ${result.matchedCount}, modified ${result.modifiedCount}`);
  }

  // Show samples
  const samples = await db.collection('sitework').find().limit(5).toArray();
  for (const s of samples) {
    console.log(`  ${s.clientId} | ${s.constructionName} | ${s.place}`);
  }

  await client.close();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
