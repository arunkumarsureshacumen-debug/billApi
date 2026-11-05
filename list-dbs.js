const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const adminDb = client.db().admin();
  const dbs = await adminDb.listDatabases();
  console.log('Databases:', dbs.databases.map(d => d.name));
  for (const dbInfo of dbs.databases) {
    const db = client.db(dbInfo.name);
    const collections = await db.listCollections().toArray();
    console.log(`\n${dbInfo.name}:`);
    for (const c of collections) {
      const count = await db.collection(c.name).countDocuments();
      console.log(`  ${c.name}: ${count} docs`);
    }
  }
  await client.close();
}
run().catch(e => { console.error('Fatal:', e); process.exit(1); });
