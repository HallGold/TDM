var Base64 = require('js-base64').Base64;
console.log(Base64.encode("{a:'1',b:'2'}"));  // ZGFua29nYWk=
console.log(Base64.encode('小飼弾'));    // 5bCP6aO85by+
console.log(Base64.encodeURI('小飼弾')); // 5bCP6aO85by-

console.log(Base64.decode('ZGFua29nYWk='));  // dankogai
console.log(Base64.decode('5bCP6aO85by+'));  // 小飼弾
// note .decodeURI() is unnecessary since it accepts both flavors
console.log(Base64.decode('eyJleHBpcmUiOjE1NzIzMzIxNDg3MjMsInVzZXJDb2RlIjoiaHVhbmdjbTEzMDEwMCIsImZpbGVpZCI6ImRiZTA4MjgwMGIwYTQ4OTViNzJlZWVlNDQyNTY4NDAzIiwic2lnbiI6IjEwMjk3NUM1REY0MEJGMEY1QUU3MTM4ODRCQTU4OTE0In0='));  // 小飼弾


var MD5 = require('md5.js')

console.log(new MD5().update("{a:'1',b:'2'}").digest('HEX').toUpperCase())