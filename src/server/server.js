const express = require('express');
const path = require('path');
const http = require('http');
const sio = require('socket.io');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 5000;
const server = http.createServer(app).listen(port);
const io = sio(server, { origins: '*:*' });

if (process.env.NODE_ENV === 'production') {
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

	// message
	socket.on('message', (message) => socket.broadcast.to(room).emit('message', message));

	// find
	socket.on('find', ({ roomId }) => {
		console.log('[server] find', socket.id, roomId);
		room = roomId;
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

	// auth
	socket.on('auth', (data) => {
		console.log('[server] auth', socket.id);
		data.sid = socket.id;
		socket.broadcast.to(room).emit('approve', data);
	});

	// accept
	socket.on('accept', (id) => {
		console.log('[server] accept', socket.id);
		io.sockets.connected[id].join(room);
		io.in(room).emit('bridge');
	});

	// reject
	socket.on('reject', () => socket.emit('full'));

	// leave
	socket.on('leave', () => {
		console.log('[server] leave', socket.id);
		socket.broadcast.to(room).emit('hangup');
		socket.leave(room);
	});
});
