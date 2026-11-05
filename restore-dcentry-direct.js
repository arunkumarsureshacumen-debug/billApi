/**
 * restore-dcentry-direct.js
 *
 * Lifts Sails programmatically and inserts DcEntry records directly via the model.
 * Usage: node restore-dcentry-direct.js
 */
var path = require('path');
var Sails = require('sails').constructor;
var fs = require('fs');

var appPath = path.resolve(__dirname);
var dataPath = path.resolve(__dirname, 'dcentry-data.json');

var records = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

Sails().lift({
  sails: {
    log: { level: 'warn' },
    hooks: { grunt: false, views: false, sockets: false, pubsub: false },
    models: { migrate: 'safe' },
    port: 1499
  }
}, async function (err, sails) {
  if (err) {
    console.error('Failed to lift Sails:', err);
    process.exit(1);
  }

  console.log('Sails lifted, inserting ' + records.length + ' DcEntry records...');

  // Strip id, createdAt, updatedAt, client fields - let DB auto-generate
  var toInsert = records.map(function (r) {
    return {
      date: r.date,
      varientName: r.varientName,
      name: r.name,
      clientId: r.clientId || '',
      product: r.product,
      Quantity: r.Quantity,
      vehicleNumber: r.vehicleNumber || '',
      DcNumber: r.DcNumber || '',
      ActualDcNumber: r.ActualDcNumber || ''
    };
  });

  var success = 0;
  var fail = 0;

  for (var i = 0; i < toInsert.length; i++) {
    try {
      await DcEntry.create(toInsert[i]).fetch();
      success++;
    } catch (e) {
      console.error('FAIL [' + (i+1) + '/' + toInsert.length + '] ' + toInsert[i].date + ' ' + toInsert[i].varientName + ' ' + toInsert[i].name + ': ' + e.message);
      fail++;
    }
    if ((i+1) % 50 === 0) {
      console.log('Progress: ' + (i+1) + '/' + toInsert.length + ' (OK:' + success + ' Fail:' + fail + ')');
    }
  }

  console.log('\nDone. Success: ' + success + ', Failed: ' + fail);
  sails.lower();
  process.exit(0);
});
