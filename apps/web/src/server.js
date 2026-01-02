import express from 'express'
import next from 'next'
import { createServer } from 'http'
import { Server } from 'socket.io'
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  const expressApp = express()
  const server = createServer(expressApp)
  const io = new Server(server)
  // Real-time communication logic
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)
    socket.on('chat-message', (msg) => {
      io.emit('chat-message', msg) // broadcast to all clients including sender (if you want to broadcast to all client excluding sender, you have to call socket.emit function instead of io.emit function)
    })
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })
  expressApp.all('*', (req, res) => handle(req, res))
  server.listen(3000, () => {
    console.log('> Server running on http://localhost:3000')
  })
})
