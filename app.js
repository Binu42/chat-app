const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 5000, (req, res) => {
    console.log(`server is running at 5000`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);

    // Disconnect
    socket.on('disconnect', (data) => {
        // if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateusers();
        connections.splice(connections.indexOf(socket), 1);
        console.log('disconnected: %s sockets connecion', connections.length);
    })

    // send message
    socket.on('send message', data => {
        io.sockets.emit('new message', {msg: data, user: socket.username});
    })

    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateusers();
    });

    function updateusers(){
        io.sockets.emit('get users', users);
    }

})