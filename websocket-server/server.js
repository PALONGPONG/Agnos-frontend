import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

dotenv.config()

const SOCKET_PORT = Number(process.env.SOCKET_PORT ?? 3001)
const SOCKET_CORS_ORIGIN = process.env.SOCKET_CORS_ORIGIN ?? '*'

const EMPTY_PATIENT_DATA = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  nationality: '',
  religion: '',
  preferredLanguage: '',
  phoneNumber: '',
  email: '',
  address: '',
  emergencyContactName: '',
  emergencyContactRelationship: '',
  status: 'inactive',
}

let latestPatientData = { ...EMPTY_PATIENT_DATA }

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true, status: 'ready' }))
    return
  }

  res.writeHead(404)
  res.end()
})

const io = new Server(httpServer, {
  cors: {
    origin: SOCKET_CORS_ORIGIN === '*' ? '*' : SOCKET_CORS_ORIGIN.split(','),
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  if (latestPatientData) {
    socket.emit('staff:update', latestPatientData)
  }

  socket.on('patient:update', (data) => {
    latestPatientData = data
    socket.broadcast.emit('staff:update', data)
  })

  socket.on('disconnect', () => {
    const inactivePayload = {
      ...(latestPatientData ?? EMPTY_PATIENT_DATA),
      status: 'inactive',
    }
    latestPatientData = inactivePayload
    socket.broadcast.emit('staff:update', inactivePayload)
  })
})

httpServer.listen(SOCKET_PORT, () => {
  console.log(`Websocket server listening on port ${SOCKET_PORT}`)
  console.log(`CORS origin: ${SOCKET_CORS_ORIGIN}`)
})
