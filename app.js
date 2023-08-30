const express = require("express")
const path  = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const server = app.listen(PORT, ()=> console.log(`Server on port ${PORT}`))

// Get socket
const io = require('socket.io')(server)

app.use(express.static(path.join(__dirname, 'public')))

let socketsConnected = new Set()


onConnected = (socket) => {
    console.log(socket.id);
    socketsConnected.add(socket.id)
    io.emit('clients-total', socketsConnected.size)

    socket.on('disconnect', ()=> {
        console.log(socket.id);
        socketsConnected.delete(socket.id)
        io.emit('clients-total', socketsConnected.size)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('chat-message', data)
    })


    socket.on('feedback', (data)=>{
        socket.broadcast.emit('feedback', data)
    })
}

io.on('connection', onConnected)