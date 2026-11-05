const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const dcCol = db.collection('dcentry');
  const clCol = db.collection('clientlist');

  // Sample DcEntry records
  const dcSamples = await dcCol.find({}).limit(5).toArray();
  console.log('=== DcEntry samples ===');
  dcSamples.forEach(d => console.log(`  _id:${d._id}, clientId:${d.clientId}, client:${d.client}, name:${d.name}`));

  // ClientList samples
  const clSamples = await clCol.find({}).limit(5).toArray();
  console.log('\n=== ClientList samples ===');
  clSamples.forEach(c => console.log(`  _id:${c._id}, clientId:${c.clientId}, name:${c.name}`));

  // Counts
  console.log(`\nDcEntry count: ${await dcCol.countDocuments()}`);
  console.log(`ClientList count: ${await clCol.countDocuments()}`);

  await client.close();
}
run().catch(e => { console.error(e); process.exit(1); });
