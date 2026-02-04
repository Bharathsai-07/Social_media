import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { inngest, functions } from './inngest/index.js'
import { serve } from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRoute.js'
import postRouter from './routes/postRoutes.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

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

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)

app.get('/', (req, res) => {
  res.send('Server is Running')
})

try {
  app.use('/api/inngest', serve({ client: inngest, functions }))
} catch (err) {
  console.error('❌ Inngest init failed:', err)
}

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})

export default app
