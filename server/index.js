const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const router = require('./router')
const cors = require('cors')
const { addUser, getUsersInRoom, getUsers, getUser, removeUser } = require('./users')

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
    cors: {
        origin: '*'
    }
})

const PORT = process.env.PORT || 5000


io.on('connection', (socket) => {
    console.log('New user connection!!!');
    // console.log(getUsersInRoom('javascript'))
    // console.log(getUsers());

    socket.on('join', ({name, room}, callback) => {
        // console.log(name, room);
        const {error, user} = addUser({id: socket.id, name, room})
        if (error) return callback(error)
        // console.log(`${user.name} joined ${user.room} room`);
        socket.join(user.room)
        
        socket.emit('message', {user: 'bot', text:`Hi ${user.name}, welcome to ${user.room}`})
        socket.broadcast.to(user.room).emit('message', {user: 'bot', text:`${user.name} just joined the room`})
        // // the difference between io.to and socket.broadcast.to is that the latter will broadcast the message to all the sockets in the room, including the socket that triggered the event (the socket that joined) while the former will broadcast to everyone in the room except the one that joined
        // io.to(user.room).emit('message', {text:`${user.name} just joined the room`})

        io.to(user.room).emit('roomUsers', {room: user.room, users: getUsersInRoom(user.room)})

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('message', {user: user.name, text: message})
        console.log(message)
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', {user: 'bot', text: `${user.name} has left the room`})
            io.to(user.room).emit('roomUsers', {room: user.room, users: getUsersInRoom(user.room)})
        }
        console.log('User disconnected!')
    })
})

app.use(router)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
