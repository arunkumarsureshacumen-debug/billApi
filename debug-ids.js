const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;
const data = require('./dcentry-data.json');

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const dcCol = db.collection('dcentry');

  const sample = await dcCol.findOne({});
  console.log('MongoDB doc _id type:', typeof sample._id, sample._id);
  
  const jsonSample = data[0];
  console.log('JSON id type:', typeof jsonSample.id, jsonSample.id);
  console.log('JSON client type:', typeof jsonSample.client, jsonSample.client);
  
  // Try matching
  const jsonIds = data.map(r => r.id);
  const mongoIds = (await dcCol.find({}, { projection: { _id: 1 } }).toArray()).map(d => d._id);
  console.log(`\nJSON ids count: ${jsonIds.length}, unique: ${new Set(jsonIds).size}`);
  console.log(`Mongo ids count: ${mongoIds.length}, unique: ${new Set(mongoIds).size}`);
  
  // Check intersection
  const jsonSet = new Set(jsonIds);
  const mongoSet = new Set(mongoIds);
  const common = jsonIds.filter(id => mongoSet.has(id));
  console.log(`Common between JSON and Mongo: ${common.length}`);
  
  // If 0 common, check types more carefully
  if (common.length === 0) {
    console.log('\nNo matches found. Checking type mismatch...');
    console.log('Sample JSON id:', JSON.stringify(jsonIds[0]));
    console.log('Sample Mongo _id:', JSON.stringify(mongoIds[0]));
    console.log('typeof JSON id:', typeof jsonIds[0]);
    console.log('typeof Mongo _id:', typeof mongoIds[0]);
    console.log('strict equality:', jsonIds[0] === mongoIds[0]);
    
    // Try finding one by string
    const byString = await dcCol.findOne({ _id: jsonIds[0] });
    console.log('Find by string _id:', byString ? 'FOUND' : 'NOT FOUND');
    if (byString) {
      console.log('Found doc client:', byString.client);
    }
  }
  
  // Check duplicate original client IDs
  const clientIdMap = {};
  data.forEach(r => {
    const cid = r.clientId;
    if (!cid) return;
    if (!clientIdMap[cid]) {
      clientIdMap[cid] = [];
    }
    if (!clientIdMap[cid].includes(r.client)) {
      clientIdMap[cid].push(r.client);
    }
  });
  
  // Find clientIds that have multiple different client IDs
  console.log('\nClientIds with multiple original client IDs:');
  let totalUniqueClientRefs = new Set();
  Object.entries(clientIdMap).forEach(([cid, clients]) => {
    clients.forEach(c => totalUniqueClientRefs.add(c));
    if (clients.length > 1) {
      console.log(`${cid} -> [${clients.join(', ')}]`);
    }
  });
  console.log(`\nTotal unique clientId values: ${Object.keys(clientIdMap).length}`);
  console.log(`Total unique original client refs: ${totalUniqueClientRefs.size}`);

  await client.close();
}
run().catch(e => { console.error(e); process.exit(1); });
