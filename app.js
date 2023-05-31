const express = require('express')
const expSession = require('express-session')
const connectFlash = require('connect-flash')
const methodOverride = require('method-override')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const jsDocOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitter-api-2020',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {  //# arbitrary name for the security scheme
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './routes/modules/*.js'], // files containing annotations as above
}

const swaggerSpec = swaggerJsdoc(jsDocOptions)

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const helpers = require('./_helpers.js')
const routes = require('./routes')
const passport = require('./config/passport.js')

const app = express()
const port = process.env.PORT || 3000
const httpServer = require('http').createServer(app)
const { Server } = require('socket.io')
const io = new Server(httpServer, { /* options */ })

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.json())
app.use(connectFlash())
app.use(expSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use('/api', routes)

app.get('/swagger/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/ws.html')
})
io.on('connection', (socket) => {
  console.log('a user connected')
  console.log('socketId:', socket.id)
  console.log('socketRoom:', socket.rooms)
  socket.on('disconnect', () => {
    console.log('a user disconnected')
    console.log('socketId:', socket.id)
  })

  socket.on('test1', (data) => {
    console.log(data)
  })

  socket.on('enterPrivateRoom', (roomData) => {
    const room = roomData.rooms[Math.floor(Math.random() * 3)]
    if (socket.rooms.size === 1) {
      socket.emit('message', `Join Room: ${room}`)
      return socket.join(room)
    }
    console.log(roomData, room, socket.rooms)
  })

  socket.on('message', (msgData) => {
    console.log(msgData, socket.rooms)
    io.to(msgData.chatRoomId).emit('message', msgData.message)
  })
})

app.listen(port, () => console.info(`Example app listening on port ${port}!`))

httpServer.listen(3001)

module.exports = app
