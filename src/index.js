const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let broadcaster = null;
const APP_PORT = 3030;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        if (!broadcaster) {
            broadcaster = ws;
            console.log('Broadcaster set.');
        }

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        if (ws === broadcaster) {
            broadcaster = null;
            console.log('Broadcaster disconnected.');
        }
    });
});

app.get('/', (req, res) => {
    res.send('Audio broadcasting server is running.');
});

server.listen(APP_PORT, () => {
    console.log(`Server running on http://localhost:${APP_PORT}`);
});
