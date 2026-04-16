const { PeerServer } = require('peer');  
const fs = require('fs');


const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  key: '1488pozvony',  
  allow_discovery: true,
  cors_options: {
    origin: [
                "http://178.72.178.50",
                "https://1488-pozvony.ru",
                "https://1488-pozvony.ru/",
                "http://1488-pozvony.ru",
                "https://178.72.178.50",
                "https://localhost:6379",
                "https://localhost:9000",
                "https://localhost:80",
                "http://localhost:80",
                "http://localhost:9000",
                "http://localhost:6379"
    ],
    credentials: true
  },
  ssl: {
    key: fs.readFileSync('/etc/letsencrypt/live/1488-pozvony.ru/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/1488-pozvony.ru/fullchain.pem')
  },
  debug: 1
});


peerServer.on("open", function (id) {
  console.log("My peer ID is: " + id);
});

peerServer.on('connection', (conn) => {
  console.log('Client connected:', conn.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});

peerServer.on('message', (client) => {
  console.log('Client disconnected:', client.getSocket());
});




// var call = peer.call("dest-peer-id", mediaStream);


console.log('PeerJS server running on port 9000');