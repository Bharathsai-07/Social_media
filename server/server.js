import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { inngest, functions } from './inngest/index.js'
import { serve } from 'inngest/express'

const app = express()

app.use(express.json())
app.use(cors())

let isConnected = false

app.use(async (req, res, next) => {
  try {
    if (!isConnected) {
      await connectDB()
      isConnected = true
    }
    next()
  } catch (err) {
    console.error('❌ DB connection failed:', err)
    res.status(500).json({ error: 'Database connection failed' })
  }
})

app.get('/', (req, res) => {
  res.send('Server is Running')
})

try {
  app.use('/api/inngest', serve({ client: inngest, functions }))
} catch (err) {
  console.error('❌ Inngest init failed:', err)
}

export default app
