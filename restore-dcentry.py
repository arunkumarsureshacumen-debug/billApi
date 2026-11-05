import json, urllib.request, sys, os

with open(os.path.join(os.path.dirname(__file__), 'dcentry-data.json')) as f:
    data = json.load(f)

success = 0
fail = 0
for i, rec in enumerate(data):
    body = {k: v for k, v in rec.items() if k not in ('_id', 'id', 'createdAt', 'updatedAt', 'client')}
    payload = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(
        'http://localhost:1400/DcEntry',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                success += 1
            else:
                print(f'FAIL [{resp.status}] {rec["date"]} {rec["varientName"]} {rec["name"]}')
                fail += 1
    except Exception as e:
        print(f'ERROR: {rec["date"]} {rec["varientName"]} {rec["name"]}: {e}')
        fail += 1
    if (i+1) % 50 == 0:
        print(f'Progress: {i+1}/{len(data)} (OK:{success} Fail:{fail})')

print(f'\nDone. Success: {success}, Failed: {fail}')
