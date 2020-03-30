const express = require('express');
const path = require('path');
var cors = require('cors');
const port = process.env.PORT || 8085;
const app = express();
const https = require('https');
const fs = require('fs');

// the __dirname is the current directory from where the script is running

app.use(cors());

app.use(express.static(__dirname));


// send the user to index html page inspite of the url
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
// we will pass our 'app' to 'https' server
https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'ABC123456'
}, app)
    .listen(3000);

console.log('listening on port:', port);
app.listen(port);