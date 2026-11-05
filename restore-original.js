const { MongoClient } = require('./node_modules/mongodb');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const uri = process.env.MONGODB_URL;

const raw = `1 2026-04-03 Arun RENT 20FT 50
2 2026-04-03 Arun RENT 10FT 60
3 2026-04-03 Arun RENT 6FT 274
4 2026-04-03 Arun RENT 2FT 110
5 2026-04-01 Mari RENT 6FT 200
6 2026-04-01 Mari RENT 4FT 25
7 2026-04-01 kappal RENT 20FT 495
8 2026-04-01 kappal RENT 10FT 110
9 2026-04-01 kappal RENT 6FT 1350
10 2026-04-01 kappal RENT 4FT 962
11 2026-04-01 kappal RENT 2FT 43
12 2026-04-01 kappal RENT JP 260
13 2026-04-01 kappal RENT JALLY 52
14 2026-04-01 kappal RENT WHEEL 6
15 2026-04-01 Suresh PURCHASE B_PLATE 5
16 2026-05-06 Ram RENT LADDER 5
17 2026-05-13 suresh PURCHASE 20FT 34
18 2026-05-13 suresh PURCHASE 3FT 6
19 2026-05-13 suresh PURCHASE 2FT 24
20 2026-05-13 mari RENT 6FT 60
21 2026-05-13 ariram RENT 4FT 150
22 2026-05-13 jegadish RENT 20FT 9
23 2026-05-20 madhavan RENT JALLY 130
24 2026-05-20 kappal RENT JP 150
25 2026-05-20 kappal RENT 6FT 200
26 2026-05-20 welding pattu RENT JALLY 15
27 2026-05-23 yohalakshmi PURCHASE JP 50
28 2026-05-23 yohalakshmi PURCHASE JALLY 20
29 2026-05-25 welding pattu RENT JALLY 9
30 2026-05-31 suresh PURCHASE 4FT 421
31 2026-06-01 suresh PURCHASE 6FT 23
32 2026-06-01 suresh PURCHASE 4FT 11
33 2026-06-01 suresh PURCHASE JP 38
34 2026-06-01 ram RENT JALLY 75
35 2026-06-03 arun RETURN 20FT 25
36 2026-06-03 arun RETURN 10FT 11
37 2026-06-03 arun RETURN 6FT 137
38 2026-06-03 arun RETURN 2FT 62`;

const types = ['RENT', 'PURCHASE', 'RETURN'];

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('yourDatabaseName');

  // Clear existing
  await db.collection('original').deleteMany({});
  console.log('Cleared original collection');

  const lines = raw.trim().split('\n');
  const docs = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Remove seq number
    const noSeq = trimmed.replace(/^\d+\s+/, '');
    const date = noSeq.substring(0, 10);
    const rest = noSeq.substring(11);

    // Find transaction type
    let typeIdx = -1;
    let foundType = '';
    for (const t of types) {
      const idx = rest.indexOf(' ' + t + ' ');
      if (idx > -1) {
        typeIdx = idx + 1; // +1 for the space
        foundType = t;
        break;
      }
    }
    // Handle last word (no trailing space)
    if (typeIdx === -1) {
      for (const t of types) {
        if (rest.endsWith(' ' + t)) {
          typeIdx = rest.lastIndexOf(' ' + t) + 1;
          foundType = t;
          break;
        }
      }
    }

    if (typeIdx === -1) {
      console.log('SKIP - no type:', trimmed);
      continue;
    }

    const name = rest.substring(0, typeIdx).trim();
    const afterType = rest.substring(typeIdx + foundType.length).trim();
    // Split pipe and quantity (last word is qty)
    const parts = afterType.split(' ');
    const quantity = parseInt(parts.pop(), 10);
    const pipe = parts.join(' ');

    if (isNaN(quantity)) {
      console.log('SKIP - bad qty:', trimmed);
      continue;
    }

    docs.push({
      date,
      name,
      transaction_type: foundType,
      pipe,
      quantity,
      status: 'Active'
    });
  }

  if (docs.length) {
    const r = await db.collection('original').insertMany(docs);
    console.log(`Inserted ${r.insertedCount} records`);
  }

  const count = await db.collection('original').countDocuments();
  console.log(`Total: ${count}`);

  const samples = await db.collection('original').find().limit(5).toArray();
  for (const s of samples) {
    console.log(`  ${s.date} | ${s.name} | ${s.transaction_type} | ${s.pipe} | ${s.quantity}`);
  }

  await client.close();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
