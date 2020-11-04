const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('socket.io');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
const io = sio(server, { origins: '*:*' });

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  app.use((req, res) => res.sendFile(path.join(__dirname, '../../build/index.html')));
} else {
  app.get('/', (req, res) => res.json({ status: 'ok' }));
}
app.use(compression());
// Switch off the default 'X-Powered-By: Express' header
app.disable('x-powered-by');
io.sockets.on('connection', (socket) => {
	let room = '';
	// sending to all clients in the room (channel) except sender
	socket.on('message', (message) => socket.broadcast.to(room).emit('message', message));
	socket.on('find', () => {
    console.log('[server] find', socket.id)
		const url = socket.request.headers.referer.split('/');
		room = url[url.length - 1];
		const sr = io.sockets.adapter.rooms[room];
		if (sr === undefined) {
			// no room with such name is found so create it
			socket.join(room);
			socket.emit('create');
		} else if (sr.length === 1) {
			socket.emit('join');
		} else {
			// max two clients
			socket.emit('full', room);
		}
	});
	socket.on('auth', (data) => {
    console.log('[server] auth', socket.id)
		data.sid = socket.id;
		// sending to all clients in the room (channel) except sender
		socket.broadcast.to(room).emit('approve', data);
	});
	socket.on('accept', (id) => {
    console.log('[server] accept', socket.id)
		io.sockets.connected[id].join(room);
		// sending to all clients in 'game' room(channel), include sender
		io.in(room).emit('bridge');
	});
	socket.on('reject', () => socket.emit('full'));
	socket.on('leave', () => {
    console.log('[server] leave', socket.id)
		// sending to all clients in the room (channel) except sender
		socket.broadcast.to(room).emit('hangup');
		socket.leave(room);
	});
});
