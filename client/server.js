const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/stream/:streamId', (req, res) => {
    res.sendFile(__dirname + '/public/stream.html')
});

app.listen(8080, () => {
    console.log('Listening on port 8080');
});