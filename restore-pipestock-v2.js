const { MongoClient, ObjectId } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

// Data recovered from the error output
const pipestockData = [
  { item_code: '10FT', quantity: 252, status: 'Active', _id: 'pipestock_10ft' },
  { item_code: '20FT', quantity: 270, status: 'Active', _id: 'pipestock_20ft' },
  { item_code: '2FT', quantity: 360, status: 'Active', _id: 'pipestock_2ft' },
  { item_code: '3FT', quantity: 17, status: 'Active', _id: 'pipestock_3ft' },
  { item_code: '4FT', quantity: 1363, status: 'Active', _id: 'pipestock_4ft' },
  { item_code: '6FT', quantity: 1273, status: 'Active', _id: 'pipestock_6ft' },
  { item_code: 'B_PLATE', quantity: 27, status: 'Active', _id: 'pipestock_bplate' },
  { item_code: 'COUPLAR', quantity: 236, status: 'Active', _id: 'pipestock_couplar' },
  { item_code: 'JALLY', quantity: 55, status: 'Active', _id: 'pipestock_jally' },
  { item_code: 'JP', quantity: 119, status: 'Active', _id: 'pipestock_jp' },
  { item_code: 'LADDER', quantity: 11, status: 'Active', _id: 'pipestock_ladder' },
  { item_code: 'L_JALLY', quantity: 3, status: 'Active', _id: 'pipestock_ljally' },
  { item_code: 'SERA_PUT', quantity: 15, status: 'Active', _id: 'pipestock_seraput' },
  { item_code: 'WHEEL', quantity: 38, status: 'Active', _id: 'pipestock_wheel' }
];

// Use deterministic ObjectIds based on item_code
function makeObjectId(code) {
  const hex = Buffer.from(code.padEnd(12, '0')).toString('hex').slice(0, 24);
  return new ObjectId(hex);
}

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const col = db.collection('pipestock');

  // Clear existing
  await col.deleteMany({});
  console.log('Cleared PipeStock collection');

  // Insert with valid ObjectIds
  const docs = pipestockData.map(r => ({
    _id: makeObjectId(r.item_code),
    item_code: r.item_code,
    quantity: r.quantity,
    status: r.status,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }));

  const result = await col.insertMany(docs, { ordered: false });
  console.log(`Inserted ${result.insertedCount} PipeStock records`);

  // Show them
  const all = await col.find().sort({ item_code: 1 }).toArray();
  console.log('\nPipeStock records:');
  all.forEach(r => console.log(`  ${r.item_code} -> _id=${r._id} qty=${r.quantity}`));

  await client.close();
}
run().catch(e => { console.error('Fatal:', e); process.exit(1); });
