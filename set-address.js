const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const col = db.collection('clientlist');

  const result = await col.updateMany(
    {},
    { $set: { address: 'YL client details.pdf' } }
  );
  console.log(`Updated ${result.modifiedCount} ClientList records with address=YL client details.pdf`);

  // Verify
  const samples = await col.find({}).limit(3).toArray();
  samples.forEach(c => console.log(`  ${c.clientId || '(empty)'}: address="${c.address}"`));

  await client.close();
}
run().catch(e => { console.error(e); process.exit(1); });
