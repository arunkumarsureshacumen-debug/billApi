const { MongoClient } = require('./node_modules/mongodb');

require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

const stockData = [
  { "_id": "pipestock_6ft", "item_code": "6FT", "quantity": 1273, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_4ft", "item_code": "4FT", "quantity": 1363, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_jp", "item_code": "JP", "quantity": 119, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_bplate", "item_code": "B_PLATE", "quantity": 27, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_10ft", "item_code": "10FT", "quantity": 252, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_3ft", "item_code": "3FT", "quantity": 17, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_couplar", "item_code": "COUPLAR", "quantity": 236, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_jally", "item_code": "JALLY", "quantity": 55, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_ladder", "item_code": "LADDER", "quantity": 11, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_20ft", "item_code": "20FT", "quantity": 270, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_2ft", "item_code": "2FT", "quantity": 360, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_wheel", "item_code": "WHEEL", "quantity": 38, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_ljally", "item_code": "L_JALLY", "quantity": 3, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() },
  { "_id": "pipestock_seraput", "item_code": "SERA_PUT", "quantity": 15, "status": "Active", "createdAt": Date.now(), "updatedAt": Date.now() }
];

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');
  const col = db.collection('pipestock');

  await col.deleteMany({}); // clear any existing
  const result = await col.insertMany(stockData);
  console.log(`Inserted ${result.insertedCount} PipeStock records`);

  const total = await col.countDocuments();
  console.log(`Total in collection: ${total}`);
  await client.close();
}

run().catch(e => { console.error('Fatal:', e); process.exit(1); });
