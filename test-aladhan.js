import https from 'https';

https.get('https://api.aladhan.com/v1/gToH?date=03-05-2026', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log(JSON.parse(data).data.hijri.date);
    } catch(err) {
      console.error(err);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
