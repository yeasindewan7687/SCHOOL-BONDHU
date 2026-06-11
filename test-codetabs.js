import https from 'https';

https.get('https://api.codetabs.com/v1/proxy?quest=https://ajkertarikh.com', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      console.log(data.slice(0, 500));
    } catch(err) {
      console.error(err);
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
