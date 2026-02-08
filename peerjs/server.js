const { PeerServer } = require('peer');

const peerServer = PeerServer({
  port: 9000,
  path: '/peerjs',
  allow_discovery: true,
  cors_options: {
    origin: ['http://localhost:3000', 'http://frontend:80', 'http://localhost:80'],
    credentials: true
  },
  ssl: process.env.NODE_ENV === 'production' ? {
    key: process.env.SSL_KEY,
    cert: process.env.SSL_CERT
  } : undefined,
  proxied: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production'
});

console.log('PeerJS server running on port 9000');