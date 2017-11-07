const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const uuid = require('uuid');
const Streamer = require('./streamr');
let streamr = new Streamer();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

const port = 3000;

wss.on('connection', ws => {

    ws.id = uuid.v4();

    ws.on('message', message => {
        message = JSON.parse(message);
        console.log(message);
        
        let clients = null;

        switch(message.type) {
            case 'STREAM_JOIN':
                const stream = streamr.addClientToStream(message.data.streamId, ws.id);
                ws.send(JSON.stringify({
                    type: 'STREAM_URL',
                    data: {
                        url: stream.url
                    }
                }))

                // Request stream position from first client in stream
                const client = streamr.getClientInStream(wss.clients, message.data.streamId);
                if (client && client.id !== ws.id) {
                    client.send(JSON.stringify({
                        type: 'STREAM_REQUEST_POSITION'
                    }));
                }
                break;

            case 'STREAM_URL':
                // URL changed
                streamr.updateStreamUrl(message.data.streamId, message.data.url);
                clients = streamr.getClientsInStream(wss.clients, message.data.streamId);
                clients.forEach(c => {
                    c.send(JSON.stringify({
                        type: 'STREAM_URL',
                        data: {
                            url: message.data.url
                        }
                    }));
                });
                break;

            case 'STREAM_PLAY':
                // Play the stream
                clients = streamr.getClientsInStream(wss.clients, message.data.streamId);
                clients.forEach(c => {
                    c.send(JSON.stringify({
                        type: 'STREAM_PLAY'
                    }));
                });
                break;

            case 'STREAM_PAUSE':
                // Pause the stream
                clients = streamr.getClientsInStream(wss.clients, message.data.streamId);
                clients.forEach(c => {
                    c.send(JSON.stringify({
                        type: 'STREAM_PAUSE'
                    }));
                });
                break;

            case 'STREAM_STOP':
                // Stop the stream
                clients = streamr.getClientsInStream(wss.clients, message.data.streamId);
                clients.forEach(c => {
                    c.send(JSON.stringify({
                        type: 'STREAM_STOP'
                    }));
                });
                break;

            case 'STREAM_POSITION':
                // Update the position (Seeking)
                clients = streamr.getClientsInStream(wss.clients, message.data.streamId);
                clients.forEach(c => {
                    c.send(JSON.stringify({
                        type: 'STREAM_POSITION',
                        data: {
                            position: message.data.position
                        }
                    }));
                });
                break;
        } 
    })
});

server.listen(port, () => {
    console.log('Listening on %d', server.address().port);
});