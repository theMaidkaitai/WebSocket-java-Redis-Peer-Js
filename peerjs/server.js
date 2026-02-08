const { PeerServer } = require('peer');  

const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  key: 'peerjs-secret-key',  
  allow_discovery: true,
  cors_options: {
    origin: ['http://localhost:3000', 'http://frontend:80', 'http://localhost:80'],
    credentials: true
  },
  ssl: null,
  debug: 3
});

peerServer.on('connection', (client) => {
  console.log('Client connected:', client.getId());
});

peerServer.on('disconnect', (client) => {
  console.log('Client disconnected:', client.getId());
});

console.log('PeerJS server running on port 9000');