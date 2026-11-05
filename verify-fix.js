const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');

  // Verify client references match
  const dc = await db.collection('dcentry').find({}).limit(5).toArray();
  console.log('DcEntry samples:');
  dc.forEach(d => console.log(`  id=${d._id} clientId=${d.clientId} client=${d.client}`));

  // Check a specific client reference
  const cl = await db.collection('clientlist').findOne({ _id: '69cfa22baed50671c3f889d2' });
  console.log('\nClientList for 69cfa22baed50671c3f889d2:', cl ? `name=${cl.name} clientId=${cl.clientId}` : 'NOT FOUND');

  // Count the Sails-created default record
  const defaultCl = await db.collection('clientlist').find({ status: 'active' }).toArray();
  console.log(`\nClientList with status "active" (lowercase): ${defaultCl.length}`);
  if (defaultCl.length > 0) {
    console.log(`Default record id: ${defaultCl[0]._id}, name: "${defaultCl[0].name}"`);
  }

  await client.close();
}
run().catch(e => { console.error(e); process.exit(1); });
