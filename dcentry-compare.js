// Compare old vs new DcEntry data
const oldData = require('./dcentry-old-data.json');
const newData = require('./dcentry-new-data.json');

// Build maps by id
const oldMap = {};
for (const item of oldData) {
  oldMap[item.id] = item;
}

const newMap = {};
for (const item of newData) {
  newMap[item.id] = item;
}

const oldIds = Object.keys(oldMap);
const newIds = Object.keys(newMap);

console.log(`Old count: ${oldIds.length}`);
console.log(`New count: ${newIds.length}`);
console.log(`Difference: ${oldIds.length - newIds.length} records missing in new`);

// Find missing IDs
const missingInNew = oldIds.filter(id => !newMap[id]);
const extraInNew = newIds.filter(id => !oldMap[id]);

console.log(`\nMissing in new (${missingInNew.length}):`);
missingInNew.forEach(id => {
  const item = oldMap[id];
  console.log(`  ${id}: DC#${item.DcNumber} ${item.varientName} ${item.name} ${item.clientId} ${item.date}`);
});

if (extraInNew.length > 0) {
  console.log(`\nExtra in new (${extraInNew.length}):`);
  extraInNew.forEach(id => {
    const item = newMap[id];
    console.log(`  ${id}: DC#${item.DcNumber} ${item.varientName} ${item.name} ${item.clientId} ${item.date}`);
  });
}

// Check for records with same id but different data
console.log(`\nChecking for data differences on matching records...`);
let diffCount = 0;
for (const id of oldIds) {
  if (newMap[id]) {
    const old = oldMap[id];
    const neu = newMap[id];
    // Check key fields
    const fields = ['date', 'varientName', 'name', 'clientId', 'vehicleNumber', 'DcNumber', 'ActualDcNumber', 'client'];
    for (const f of fields) {
      if (JSON.stringify(old[f]) !== JSON.stringify(neu[f])) {
        if (diffCount < 10) {
          console.log(`  DIFF ${id}: ${f} old=${JSON.stringify(old[f])} new=${JSON.stringify(neu[f])}`);
        }
        diffCount++;
      }
    }
  }
}
if (diffCount >= 10) console.log(`  ... and ${diffCount - 10} more diffs`);
console.log(`Total field-level diffs: ${diffCount}`);
