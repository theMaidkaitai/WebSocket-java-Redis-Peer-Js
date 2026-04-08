const { PeerServer } = require('peer');  

const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  key: 'peerjs-secret-key',  
  allow_discovery: true,
  cors_options: {
    origin: [
                "http://localhost:5173",
                "https://localhost:5173",
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
  ssl: true,
  debug: 3
});

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});



// var call = peer.call("dest-peer-id", mediaStream);


console.log('PeerJS server running on port 9000');