async function test() {
  const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://ajkertarikh.com'));
  const data = await res.text();
  console.log(data.slice(0, 200));
}
test();
