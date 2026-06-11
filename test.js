import https from 'https';

https.get('https://ajkertarikh.com/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const bnMatch = data.match(/([০-৯]+ই? [অ-য়]+ [০-৯]+ বঙ্গাব্দ)/);
    const enMatch = data.match(/([০-৯]+রা? [অ-য়]+, [০-৯]+ খ্রিস্টাব্দ)/);
    const arMatch = data.match(/([০-৯]+ই? [অ-য়]+, [০-৯]+ হিজরি)/);
    console.log("Bangla:", bnMatch ? bnMatch[1] : null);
    console.log("English:", enMatch ? enMatch[1] : null);
    console.log("Arabic:", arMatch ? arMatch[1] : null);
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
